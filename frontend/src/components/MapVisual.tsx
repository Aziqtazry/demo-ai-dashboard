import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { Layers3, LocateFixed, Search, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './MapVisual.css';

type Kind = 'boundary' | 'road' | 'water' | 'place';
type MapFeature = Feature<Geometry, { kind: Kind; name: string; highway?: string; place?: string; osm_id: string }>;
type MapData = FeatureCollection<Geometry, MapFeature['properties']> & { snapshot: string };
let cachedData: Promise<MapData> | undefined;

function loadData() {
    cachedData ??= fetch(`${import.meta.env.BASE_URL}klang.geojson`).then(async (response) => {
        if (!response.ok) { throw new Error('GeoJSON unavailable'); }
        const data = await response.json() as MapData;
        if (data.type !== 'FeatureCollection' || !data.features?.length) { throw new Error('Invalid GeoJSON'); }
        return data;
    }).catch((error: unknown) => { cachedData = undefined; throw error; });
    return cachedData;
}

function textNode(text: string) {
    const node = document.createElement('span');
    node.textContent = text;
    return node;
}

export function MapVisual({ compact = false, focusRoad, focusRequest = 0 }: { compact?: boolean; focusRoad?: string; focusRequest?: number }) {
    const container = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const layersRef = useRef<Partial<Record<Kind, L.GeoJSON>>>({});
    const selectionRef = useRef<L.Layer | null>(null);
    const boundaryRef = useRef<L.LatLngBounds | null>(null);
    const [data, setData] = useState<MapData>();
    const [error, setError] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState('');
    const [layerMenu, setLayerMenu] = useState(false);
    const [visible, setVisible] = useState<Record<Kind, boolean>>({ boundary: true, road: true, water: true, place: true });

    useEffect(() => {
        if (!container.current) { return; }
        let active = true;
        const map = L.map(container.current, { zoomControl: false, preferCanvas: true, minZoom: 9, maxZoom: 18, zoomSnap: 0.25, scrollWheelZoom: false });
        mapRef.current = map;
        map.setView([3.045, 101.445], 11);
        L.control.zoom({ position: 'topright' }).addTo(map);
        L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);
        map.attributionControl.setPrefix(false);
        map.attributionControl.addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> | ODbL');
        const observer = new ResizeObserver(() => map.invalidateSize());
        observer.observe(container.current);
        loadData().then((dataset) => {
            if (!active) { return; }
            for (const kind of ['boundary', 'water', 'road', 'place'] as const) {
                const layer = L.geoJSON(dataset.features.filter((feature) => feature.properties.kind === kind), {
                    style: (feature) => {
                        if (kind === 'boundary') { return { color: '#2ab6b4', weight: 1.5, dashArray: '6 5', fillColor: '#2b7970', fillOpacity: 0.07 }; }
                        if (kind === 'water') { return { color: '#258ac0', weight: 2.5, opacity: 0.8 }; }
                        const major = /^(motorway|trunk|primary)/.test(feature?.properties.highway ?? '');
                        return { color: major ? '#a8946c' : '#64819a', weight: major ? 2.2 : 0.8, opacity: major ? 0.9 : 0.5 };
                    },
                    pointToLayer: (_feature, latlng) => L.circleMarker(latlng, { radius: 3, color: '#39bbc9', fillOpacity: 1, weight: 1 }),
                    onEachFeature: (feature, featureLayer) => {
                        const props = feature.properties;
                        featureLayer.bindPopup(() => {
                            const popup = document.createElement('div');
                            const title = document.createElement('strong');
                            title.textContent = props.name || (kind === 'road' ? 'Jalan tanpa nama' : 'Sungai / terusan');
                            popup.append(title, document.createElement('br'), textNode(kind === 'road' ? 'Geometri OSM · Data trafik belum disambungkan' : kind === 'boundary' ? 'Sempadan daerah OSM · Bukan sempadan rasmi MBDK' : 'Data OpenStreetMap'));
                            return popup;
                        });
                        if (kind === 'place' && props.name) {
                            featureLayer.bindTooltip(textNode(props.name), { permanent: true, direction: 'right', className: 'klang-place-label' });
                        }
                    },
                }).addTo(map);
                layersRef.current[kind] = layer;
            }
            const bounds = layersRef.current.boundary!.getBounds();
            boundaryRef.current = bounds;
            map.setMaxBounds(bounds.pad(0.25));
            map.fitBounds(bounds, { padding: [20, 30] });
            const updateLabels = () => {
                const occupied: { x: number; y: number; width: number }[] = [];
                layersRef.current.place?.eachLayer((layer) => {
                    const marker = layer as L.CircleMarker & { feature: MapFeature };
                    const props = marker.feature.properties;
                    const position = map.latLngToContainerPoint(marker.getLatLng());
                    const width = props.name.length * 6 + 20;
                    const important = props.place === 'city' || props.place === 'town';
                    const overlap = occupied.some((box) => Math.abs(position.y - box.y) < 18 && position.x < box.x + box.width && position.x + width > box.x);
                    if ((important || map.getZoom() >= 12) && !overlap) {
                        marker.openTooltip();
                        occupied.push({ x: position.x, y: position.y, width });
                    } else {
                        marker.closeTooltip();
                    }
                });
            };
            map.on('zoomend moveend overlayadd', updateLabels);
            updateLabels();
            setData(dataset);
        }).catch(() => { if (active) { setError(true); } });
        return () => {
            active = false;
            observer.disconnect();
            map.remove();
            mapRef.current = null;
            layersRef.current = {};
            selectionRef.current = null;
        };
    }, [attempt]);

    function selectFeatures(features: MapFeature[]) {
        const map = mapRef.current;
        if (!map || !features.length) { return; }
        if (selectionRef.current) { map.removeLayer(selectionRef.current); }
        const selection = L.geoJSON(features, {
            style: { color: '#22d3ee', weight: 5, opacity: 1, fillOpacity: 0.1 },
            pointToLayer: (_feature, latlng) => L.circleMarker(latlng, { radius: 8, color: '#22d3ee' }),
        }).addTo(map);
        selection.bindPopup(textNode(`${features[0].properties.name} · Data OSM, bukan status trafik`));
        selectionRef.current = selection;
        map.fitBounds(selection.getBounds(), { padding: [45, 60], maxZoom: 15 });
        setQuery('');
        setMessage(features[0].properties.name);
    }

    useEffect(() => {
        if (focusRoad && data) {
            const matches = data.features.filter((feature) => feature.properties.kind === 'road' && feature.properties.name.toLowerCase() === focusRoad.toLowerCase());
            if (matches.length) { selectFeatures(matches); } else { setMessage(`${focusRoad} tiada dalam snapshot OSM.`); }
        }
    }, [focusRoad, focusRequest, data]);

    const results: { name: string; features: MapFeature[] }[] = [];
    if (query.trim().length >= 2 && data) {
        const term = query.trim().toLowerCase();
        const grouped = new Map<string, MapFeature[]>();
        for (const feature of data.features) {
            const { name, kind } = feature.properties;
            if (kind !== 'boundary' && name && name.toLowerCase().includes(term)) {
                const group = grouped.get(name) ?? [];
                group.push(feature);
                grouped.set(name, group);
            }
        }
        results.push(...Array.from(grouped, ([name, features]) => ({ name, features })).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 6));
    }

    function submitSearch() {
        const coordinates = query.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
        if (coordinates && mapRef.current) {
            const point = L.latLng(Number(coordinates[1]), Number(coordinates[2]));
            if (!boundaryRef.current?.contains(point)) { setMessage('Koordinat di luar liputan peta Klang.'); return; }
            if (selectionRef.current) { mapRef.current.removeLayer(selectionRef.current); }
            selectionRef.current = L.circleMarker(point, { radius: 8, color: '#22d3ee' }).addTo(mapRef.current).bindPopup(textNode(query)).openPopup();
            mapRef.current.setView(point, 15);
            setMessage(`Koordinat: ${query}`);
            setQuery('');
        } else if (results.length) {
            selectFeatures(results[0].features);
        } else {
            setMessage('Tiada padanan. Cari nama jalan / tempat atau latitud, longitud.');
        }
    }

    function toggleLayer(kind: Kind) {
        const map = mapRef.current;
        const layer = layersRef.current[kind];
        if (!map || !layer) { return; }
        if (map.hasLayer(layer)) { map.removeLayer(layer); } else { layer.addTo(map); }
        map.fire('overlayadd');
        setVisible((previous) => ({ ...previous, [kind]: map.hasLayer(layer) }));
    }

    return (
        <div className={`klang-map relative isolate min-w-0 ${compact ? 'h-72' : 'h-[420px] sm:h-[480px]'}`}>
            <div aria-label="Peta interaktif daerah Klang" className="absolute inset-0" ref={container} />
            <div className="map-search absolute left-3 top-3 z-[500] w-[min(280px,calc(100%-72px))]">
                <form className="map-surface flex items-center gap-2 rounded-lg p-2" onSubmit={(event) => { event.preventDefault(); submitSearch(); }}>
                    <Search size={14} className="shrink-0" />
                    <input aria-label="Cari lokasi atau koordinat pada peta" autoComplete="off" className="min-w-0 flex-1 bg-transparent text-xs outline-none" disabled={!data} onChange={(event) => { setQuery(event.target.value); setMessage(''); }} placeholder="Cari jalan, tempat atau koordinat" value={query} />
                    {query && <button aria-label="Kosongkan carian" onClick={() => setQuery('')} type="button"><X size={14} /></button>}
                </form>
                {query.trim().length >= 2 && results.length > 0 && <ul className="map-surface mt-1 overflow-hidden rounded-lg">{results.map((result) => <li key={result.name}><button className="w-full px-3 py-2 text-left text-xs hover:bg-cyan-500/15" onClick={() => selectFeatures(result.features)} type="button">{result.name}</button></li>)}</ul>}
            </div>
            <div className="absolute bottom-12 left-3 z-[500] flex items-end gap-2">
                <button aria-label="Pilih lapisan peta" aria-expanded={layerMenu} className="map-surface rounded-lg p-2.5" onClick={() => setLayerMenu(!layerMenu)} type="button"><Layers3 size={16} /></button>
                <button aria-label="Papar seluruh daerah Klang" className="map-surface rounded-lg p-2.5" onClick={() => { if (boundaryRef.current) { mapRef.current?.fitBounds(boundaryRef.current, { padding: [20, 30] }); } if (selectionRef.current) { mapRef.current?.removeLayer(selectionRef.current); selectionRef.current = null; } setMessage(''); setQuery(''); }} type="button"><LocateFixed size={16} /></button>
                {layerMenu && <fieldset className="map-surface absolute bottom-12 left-0 w-48 rounded-lg p-3"><legend className="sr-only">Lapisan peta</legend>{([['boundary', 'Sempadan daerah'], ['road', 'Rangkaian jalan'], ['water', 'Sungai / terusan'], ['place', 'Nama tempat']] as const).map(([kind, label]) => <label className="flex items-center gap-2 py-1 text-xs" key={kind}><input checked={visible[kind]} disabled={!data} onChange={() => toggleLayer(kind)} type="checkbox" />{label}</label>)}</fieldset>}
            </div>
            <div className="map-surface absolute bottom-12 right-3 z-[400] hidden rounded-lg px-3 py-2 text-[10px] sm:block"><p className="font-semibold">Daerah Klang · OSM</p><p className="mt-1 opacity-70">Warna jalan bukan status trafik</p><p className="mt-1 opacity-70">{data ? `Snapshot ${data.snapshot.slice(0, 10)}` : 'Memuatkan data…'}</p></div>
            {message && <p className="map-surface absolute left-3 top-16 z-[490] max-w-[calc(100%-24px)] rounded-lg px-3 py-2 text-xs" role="status">{message}</p>}
            {!data && <div className="map-surface absolute inset-x-6 top-1/2 z-[600] mx-auto max-w-sm rounded-xl p-4 text-center text-xs" role={error ? 'alert' : 'status'}>{error ? <><p>Data peta tidak dapat dimuatkan.</p><button className="mt-3 rounded border border-cyan-500 px-3 py-2" onClick={() => { setError(false); setAttempt(attempt + 1); }} type="button">Cuba semula</button></> : 'Memuatkan peta daerah Klang…'}</div>}
        </div>
    );
}
