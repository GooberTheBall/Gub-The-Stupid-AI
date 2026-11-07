function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

async function makeMarkov(url) {
    const text = await (await fetch(url)).text();
    const words = text.toLowerCase().match(/[\w']+[.!?]?/g) ?? [];
    const chain = Object.create(null);
    const starts = [];
    
    for (let i = 0; i < words.length - 1; i++) {
        const currentWord = words[i];
        const nextWord = words[i + 1];
        
        (chain[currentWord] ??= []).push(nextWord);
        
        if (i === 0 || /[.!?]$/.test(currentWord)) {
            starts.push(nextWord);
        }
    }
    
    return function generate(maxWords = 200) {
        const startList = starts.length > 0 ? starts : Object.keys(chain);
        let w = startList[Math.floor(Math.random() * startList.length)];
        const out = [capitalizeFirstLetter(w)];
        
        const hardCap = maxWords * 4;
        
        while (out.length < hardCap) {
            if (/[.!?]$/.test(w)) {
                if (out.length >= maxWords) break;
                
                w = startList[Math.floor(Math.random() * startList.length)];
                out.push(capitalizeFirstLetter(w));
                continue;
            }
            
            const next = chain[w];
            if (!next || next.length === 0) break;
            
            w = next[Math.floor(Math.random() * next.length)];
            out.push(w);
        }
        
        return out.join(" ");
    };
}

(async () => {
    const raw = new URLSearchParams(location.search).get("maxwords");
    const parsed = parseInt(raw, 10);
    const maxWords = Number.isFinite(parsed) ? Math.max(5, Math.min(500, parsed)) : 150;
    
    const generate = await makeMarkov("words.txt");
    document.getElementById("out").textContent = generate(maxWords);
})();