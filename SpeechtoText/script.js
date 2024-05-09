document.addEventListener('DOMContentLoaded', () => {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();

    const languageSelect = document.getElementById('language');
    const resultContainer = document.querySelector('.result p.resultText');
    const startListeningBtn = document.querySelector('.btn.record');
    const recordBtnText = document.querySelector('.btn.record p');
    const clearBtn = document.querySelector('.btn.clear');
    const downloadBtn = document.querySelector('.btn.download');
    
    let recognizing = false;
    let recognizedText = ''; // Variable to store recognized text
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageSelect.value;
    
    languageSelect.addEventListener('change', () => {
        recognition.lang = languageSelect.value;
    });

    startListeningBtn.addEventListener('click', toggleSpeechRecognition);
    clearBtn.addEventListener('click', clearResults);
    
    downloadBtn.disabled = true;
    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                recognizedText += event.results[i][0].transcript + ' ';
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        // Append only the new portion of interim transcript
        recognizedText += interimTranscript.substring(recognizedText.length);
        
        resultContainer.textContent = recognizedText;
        downloadBtn.disabled = false;   
    };

    recognition.onend = () => {
        recognizing = false;
        startListeningBtn.classList.remove('recording');
        recordBtnText.textContent = 'Start Listening';
    };

    downloadBtn.addEventListener('click', downloadResult);

    function toggleSpeechRecognition() {
        if (recognizing) {
            recognition.stop();
        } else {
            recognizedText = ''; // Reset recognized text
            recognition.start();
        }

        recognizing = !recognizing;
        startListeningBtn.classList.toggle('recording', recordBtnText.textContent = 'Stop Listening');
    }

    function clearResults() {
        resultContainer.textContent = '';
        downloadBtn.disabled = true;
    }

    function downloadResult() {
        const resultText = resultContainer.textContent;

        const blob = new Blob([resultText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'Your_Text.txt';
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});
