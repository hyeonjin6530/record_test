import React, { useState, useRef } from 'react';

const ScreenRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        try {
            // 화면과 소리 모두 캡처
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true, // 오디오 옵션 추가
            });

            // 마이크 오디오 추가 (선택 사항)
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const combinedStream = new MediaStream([...stream.getTracks(), ...audioStream.getTracks()]);

            mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing display media.', error);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    return (
        <div>
            <h1>Screen Recorder</h1>
            {isRecording ? (
                <button onClick={stopRecording}>Stop Recording</button>
            ) : (
                <button onClick={startRecording}>Start Recording</button>
            )}
            {videoUrl && (
                <div>
                    <h2>Recorded Video</h2>
                    <video src={videoUrl} controls width="600" />
                </div>
            )}
        </div>
    );
};

export default ScreenRecorder;
