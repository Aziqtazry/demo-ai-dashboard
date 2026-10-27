import { useState, type SyntheticEvent } from 'react';

const sources = [
    `${import.meta.env.BASE_URL}cctv_demo/cctv_demo_1_edited.mp4`,
    `${import.meta.env.BASE_URL}cctv_demo/cctv_demo_2_edited.mp4`,
];

export function CctvVideo({ index, name }: { index: number; name: string }) {
    const [unavailable, setUnavailable] = useState(false);

    function resumePlayback(event: SyntheticEvent<HTMLVideoElement>) {
        const video = event.currentTarget;
        if (video.isConnected && !video.error && !document.hidden) {
            void video.play().catch(() => {
                // A browser may suspend media while the page is in the background.
            });
        }
    }

    return (
        <div className="absolute inset-0 bg-black" onContextMenu={(event) => event.preventDefault()}>
            <video
                aria-label={`Suapan demo CCTV: ${name}`}
                autoPlay
                className="pointer-events-none size-full object-cover"
                controls={false}
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                loop
                muted
                onCanPlay={resumePlayback}
                onError={() => setUnavailable(true)}
                onPause={resumePlayback}
                playsInline
                preload="metadata"
                src={sources[index % sources.length]}
                tabIndex={-1}
            />
            {unavailable && <span className="absolute inset-0 flex items-center justify-center p-3 text-center text-xs text-white" role="status">Suapan demo tidak tersedia</span>}
        </div>
    );
}
