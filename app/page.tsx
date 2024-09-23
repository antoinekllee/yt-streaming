import dynamic from 'next/dynamic';
import AudioPlayer from '@/components/AudioPlayer';

const youtubeIds = [
    "jKty-A4h1Qk",
    "paFtGQ22YlE",
    "o_DpuiJq9bc",
    "845By_LKvU8",
    "eQOaZPnMmoE",
];

export default function Home() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-10">
            <AudioPlayer youtubeIds={youtubeIds} />
        </div>
    );
}