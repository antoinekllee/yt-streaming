"use client";

import { useState, useRef, useEffect, forwardRef, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

import ReactPlayer from 'react-player/lazy'; 

type AudioPlayerProps = {
    youtubeIds: string[];
};

const AudioPlayer = forwardRef<HTMLDivElement, AudioPlayerProps>(({ youtubeIds }, ref) => 
{
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekValue, setSeekValue] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const playerRef = useRef<any>(null);

    const handlePlayPause = useCallback(() => {
        setIsPlaying((prev) => !prev);
    }, []);

    const handlePrevious = useCallback(() => {
        setCurrentTrackIndex((prev) => (prev > 0 ? prev - 1 : youtubeIds.length - 1));
    }, [youtubeIds.length]);

    const handleNext = useCallback(() => {
        setCurrentTrackIndex((prev) => (prev < youtubeIds.length - 1 ? prev + 1 : 0));
    }, [youtubeIds.length]);

    const handleVolumeChange = useCallback((newValue: number[]) => {
        setVolume(newValue[0]);
        setMuted(false);
    }, []);

    const handleToggleMute = useCallback(() => {
        setMuted((prev) => !prev);
    }, []);

    const handleDuration = useCallback((duration: number) => {
        setDuration(duration);
    }, []);

    const handleSeekStart = useCallback(() => {
        setIsSeeking(true);
    }, []);

    const handleSeekChange = useCallback((newValue: number[]) => {
        setSeekValue(newValue[0]);
    }, []);

    const handleSeekEnd = useCallback(() => {
        setIsSeeking(false);
        if (playerRef.current) {
            playerRef.current.seekTo(seekValue / 100);
        }
    }, [seekValue]);

    const handleProgress = useCallback(({ played }: { played: number }) => {
        if (!isSeeking) {
            setProgress(played * 100);
            setSeekValue(played * 100);
        }
    }, [isSeeking]);

    useEffect(() => {
        setIsPlaying(false);
    }, [currentTrackIndex]);

    return (
        <div ref={ref} className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <ReactPlayer
                ref={playerRef}
                url={`https://www.youtube.com/watch?v=${youtubeIds[currentTrackIndex]}`}
                playing={isPlaying}
                volume={volume}
                muted={muted}
                playbackRate={1.0}
                onProgress={handleProgress}
                onDuration={handleDuration}
                width={0}
                height={0}
            />
            <Slider
                value={[seekValue]}
                max={100}
                step={0.1}
                className="w-full mb-6"
                onValueChange={handleSeekChange}
                onValueCommit={handleSeekEnd}
                onPointerDown={handleSeekStart}
            />
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-3">
                    <Button onClick={handlePrevious} variant="outline" size="icon" className="rounded-full hover:bg-gray-100">
                        <SkipBack className="h-5 w-5 text-gray-600" />
                    </Button>
                    <Button onClick={handlePlayPause} variant="outline" size="icon" className="rounded-full hover:bg-gray-100">
                        {isPlaying ? <Pause className="h-5 w-5 text-gray-600" /> : <Play className="h-5 w-5 text-gray-600" />}
                    </Button>
                    <Button onClick={handleNext} variant="outline" size="icon" className="rounded-full hover:bg-gray-100">
                        <SkipForward className="h-5 w-5 text-gray-600" />
                    </Button>
                </div>
                <div className="flex items-center space-x-3">
                    <Button onClick={handleToggleMute} variant="outline" size="icon" className="rounded-full hover:bg-gray-100">
                        {muted ? <VolumeX className="h-5 w-5 text-gray-600" /> : <Volume2 className="h-5 w-5 text-gray-600" />}
                    </Button>
                    <Slider
                        value={[muted ? 0 : volume * 100]}
                        max={100}
                        step={1}
                        className="w-24"
                        onValueChange={(newValue) => handleVolumeChange([newValue[0] / 100])}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                    {formatTime(duration * (progress / 100))} / {formatTime(duration)}
                </div>
            </div>
        </div>
    );
});

AudioPlayer.displayName = "AudioPlayer";

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default AudioPlayer;