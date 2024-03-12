document.addEventListener('DOMContentLoaded', () => {
    const recognition = new webkitSpeechRecognition() ||
    new SpeechRecognition();

    const languageSelect  = document.getElementById('language');
    const resultContainer = document.querySelector('.result p.resultText');
    const startListeningBtn = document.querySelector('.btn.record');
    const recordBtnText = document.querySelector('.btn.record p');
    const clearBtn = document.querySelector('.btn.clear');
    const downloadBtn = document.querySelector('.btn.download');
    
    let recognizing = false;

    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.code;
        option.text = language.name;
        languageSelect.add(option);

    });

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageSelect.value;
    
    languageSelect.addEventListener('change', () =>  {
        recognition.lang = languageSelect.value;

    });
    startListeningBtn.addEventListener('click', toggleSpeechRecognition);
    clearBtn.addEventListener('click', clearResults);

    downloadBtn.disabled = true;
    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1][0].transcript;
        resultContainer.textContent = result;
        downloadBtn.disabled = false;   
    };

    recognition.onend = () => {
        recognizing = false;
        startListeningBtn.classList.remove('recording');
        recordBtnText.textContent = 'Start Listening';

    };

    downloadBtn.addEventListener('click', downloadResult);

    function toggleSpeechRecognition(){
        if (recognizing) {
            recognition.stop();
        }else {
            recognition.start();
        }

        recognizing = !recognizing;
        startListeningBtn.classList.toggle('recording', recordBtnText.textContent = 'Stop Listening');

    }

    function clearResults() {
        resultContainer.textContent = '';
        downloadBtn.disabled = true;
    }

    function downloadResult(){
        const resultText = resultContainer.textContent;

        const blob = new Blob([resultText], { type: 'text/plain'});
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