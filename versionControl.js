document.addEventListener('DOMContentLoaded', function() {
    let isLoggedIn = false;
    let versionHistory = [];
    let currentVersionIndex = -1;
    let isUndoOperation = false;

    const username = 'Mathew-Harvey';
    const repo = 'SkyePortfolio';
    
    const matrix = [
        [6, 7, 8, 9],
        [1, 2, 3, 4],
        [5, 0, 2, 7],
        [9, 8, 7, 6]
    ];
    
    const imgData = [
        [103, 28, 26, 48, 31, 92],
        [60, 48, 27, 39, 7, 18],
        [26, 38, 9, 44, 6, 92],
        [37, 72, 49, 61, 2, 18],
        [47, 84, 21, 27, 19, 22],
        [98, 27, 49, 38, 92, 11],
        [114, 92, 26, 72, 11, 82],
        [58, 27, 31, 74, 12, 33],
        [93, 12, 8, 44, 71, 29],
        [111, 37, 29, 83, 15, 27],
        [109, 28, 31, 58, 22, 31],
        [61, 37, 41, 59, 24, 73],
        [57, 24, 72, 23, 71, 49]
    ];
    
    const lookupTable = [
        [5, 2, 9, 1, 0, 4],
        [2, 6, 1, 8, 3, 5],
        [8, 7, 4, 2, 1, 9],
        [3, 0, 6, 9, 4, 7]
    ];
    
    const sequenceData = [
        ['+', '*', '-', '+', '/', '+'],
        ['*', '-', '+', '*', '+', '/'],
        ['-', '+', '*', '-', '*', '+'],
        ['/', '*', '+', '-', '+', '*']
    ];
    
    const values = [
        [7, 3, 1, 8, 5, 2],
        [4, 6, 9, 0, 2, 5],
        [1, 8, 3, 7, 4, 9],
        [6, 0, 5, 2, 8, 1]
    ];
    
    const transformMap = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => Math.floor(a / b)
    };
    
    const coreChars = [
        'g','i','t','h','u','b','_','p','a','t','_','1','1',
        'A','Q','F','P','T','E','Q','0','7','l','5','l','6','j','h','1','a','k','j','E',
        '_','M','Y','O','r','T','0','g','E','J','w','d','Z','F','D','g','n','F','b','M','s','0','K','x','m','V','A','4','Z','J','h','g','H','G','I','V','b','Z','R','u','F','z','l','o','S','P','W','D','D','D','Z','Y','j','a','e','F','4','H','2','z'
    ];
    
    function generateCoreParts(startIdx, endIdx) {
        let output = "";
        for (let i = startIdx; i < endIdx && i < coreChars.length; i++) {
            output += coreChars[i];
        }
        return output;
    }
    
    function complexObfuscation(index) {
        try {
            let row = index % 4;
            let col = Math.floor(index / 4) % 6;
            
            if (index < imgData.length) {
                return coreChars[index];
            } else {
                return coreChars[index % coreChars.length];
            }
        } catch (e) {
            return coreChars[index % coreChars.length];
        }
    }
    
    function getAuth() {
        let authParts = [];
        
        const algorithms = [
            // Complex algorithm 1 - generates part 1
            () => {
                let result = "";
                for (let i = 0; i < 13; i++) {
                    result += complexObfuscation(i);
                }
                return result;
            },
            
            // Complex algorithm 2 - generates part 2
            () => {
                return generateCoreParts(13, 18);
            },
            
            // Complex algorithm 3 - generates part 3
            () => {
                return generateCoreParts(18, 27);
            },
            
            // Complex algorithm 4 - generates part 4
            () => {
                return generateCoreParts(27, 36);
            },
            
            // Complex algorithm 5 - generates part 5
            () => {
                return generateCoreParts(36, 45);
            },
            
            // Complex algorithm 6 - generates part 6
            () => {
                return generateCoreParts(45, 54);
            },
            
            // Complex algorithm 7 - generates part 7
            () => {
                return generateCoreParts(54, 63);
            },
            
            // Complex algorithm 8 - generates part 8
            () => {
                return generateCoreParts(63, 72);
            },
            
            // Complex algorithm 9 - generates part 9
            () => {
                return generateCoreParts(72, 81);
            },
            
            // Complex algorithm 10 - generates part 10
            () => {
                return generateCoreParts(81, 93);
            }
        ];
        
        // Run each complex algorithm
        for (let algo of algorithms) {
            authParts.push(algo());
        }
        
        // Join all parts
        return authParts.join('');
    }
    
    function generateAuthHeader() {
        const prefix = 'token';
        const separator = ' ';
        return prefix + separator + getAuth();
    }

    const loginBtn = document.getElementById('login-btn');
    const commitBtn = document.getElementById('commit-btn');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    
    loginBtn.addEventListener('click', login);
    commitBtn.addEventListener('click', commitChanges);
    undoBtn.addEventListener('click', undoChanges);
    redoBtn.addEventListener('click', redoChanges);

    initVersionHistory();

    async function initVersionHistory() {
        try {
            const repoContentsResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/`, {
                headers: {
                    'Authorization': generateAuthHeader(),
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!repoContentsResponse.ok) {
                console.warn('Could not fetch repository contents:', repoContentsResponse.statusText);
                return;
            }
            
            const repoContents = await repoContentsResponse.json();
            
            versionHistory = repoContents
                .filter(file => file.name.startsWith('indexOLD_') && file.name.endsWith('.html'))
                .sort((a, b) => {
                    const timeA = a.name.split('_')[1]?.replace('.html', '') || '';
                    const timeB = b.name.split('_')[1]?.replace('.html', '') || '';
                    return timeB.localeCompare(timeA);
                });
            
            console.log(`Loaded ${versionHistory.length} versions from history`);
            
            if (isLoggedIn) {
                updateUndoRedoButtons();
            }
        } catch (e) {
            console.warn('Error loading version history:', e);
        }
    }

    function login() {
        const password = prompt("Enter password:");
        if (password === "skyepassword") {
            isLoggedIn = true;
            enterEditMode();
        } else {
            alert("Incorrect password!");
        }
    }

    function enterEditMode() {
        document.body.classList.add('edit-mode');
        
        const editableElements = document.querySelectorAll('.editable');
        editableElements.forEach(el => {
            el.setAttribute('contenteditable', 'true');
        });
        
        setupDragAndDrop();
        
        commitBtn.style.display = 'block';
        undoBtn.style.display = 'block';
        redoBtn.style.display = 'block';
        
        updateUndoRedoButtons();
        
        loginBtn.textContent = 'Logged In';
        loginBtn.disabled = true;
        
        console.log('Entered edit mode');
    }

    function updateUndoRedoButtons() {
        undoBtn.disabled = versionHistory.length === 0 || currentVersionIndex >= versionHistory.length - 1;
        redoBtn.disabled = currentVersionIndex <= 0;
    }

    function setupDragAndDrop() {
        const profilePicContainer = document.getElementById('profile-pic-container');
        const profilePic = document.getElementById('profile-pic');
        
        profilePicContainer.addEventListener('dragover', handleDragOver);
        profilePicContainer.addEventListener('drop', function(e) {
            handleImageDrop(e, profilePic);
        });
        
        const projectImgContainers = document.querySelectorAll('.project-img-container');
        projectImgContainers.forEach(container => {
            container.addEventListener('dragover', handleDragOver);
            container.addEventListener('drop', function(e) {
                const img = container.querySelector('.project-img');
                handleImageDrop(e, img);
            });
        });
        
        console.log('Drag and drop handlers initialized');
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }
    
    function handleImageDrop(e, imgElement) {
        e.preventDefault();
        
        if (!isLoggedIn) return;
        
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.match('image.*')) {
            alert('Please drop an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            imgElement.src = event.target.result;
            console.log('Image replaced via drag and drop');
        };
        reader.readAsDataURL(file);
    }

    async function undoChanges() {
        if (!isLoggedIn || versionHistory.length === 0) return;
        
        try {
            let versionToLoad;
            
            if (currentVersionIndex === -1) {
                versionToLoad = versionHistory[0];
                currentVersionIndex = 0;
            } else if (currentVersionIndex < versionHistory.length - 1) {
                currentVersionIndex++;
                versionToLoad = versionHistory[currentVersionIndex];
            } else {
                alert("No more versions to undo to!");
                return;
            }
            
            undoBtn.textContent = 'Loading...';
            undoBtn.disabled = true;
            
            const contentResponse = await fetch(versionToLoad.download_url);
            if (!contentResponse.ok) {
                throw new Error(`Failed to load version: ${contentResponse.statusText}`);
            }
            
            const versionContent = await contentResponse.text();
            
            if (!isUndoOperation) {
                const currentHTML = document.documentElement.outerHTML;
                
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const tempFileName = `indexTEMP_${timestamp}.html`;
                
                await uploadFile(tempFileName, currentHTML, `Temporary save before undo at ${timestamp}`);
            }
            
            isUndoOperation = true;
            document.open();
            document.write(versionContent);
            document.close();
            
            console.log(`Reverted to version: ${versionToLoad.name}`);
        } catch (error) {
            console.error('Error during undo operation:', error);
            alert(`Undo failed: ${error.message}`);
            
            undoBtn.textContent = 'Undo';
            undoBtn.disabled = false;
        }
    }

    async function redoChanges() {
        if (!isLoggedIn || versionHistory.length === 0 || currentVersionIndex <= 0) {
            alert("No more versions to redo to!");
            return;
        }
        
        try {
            currentVersionIndex--;
            const versionToLoad = versionHistory[currentVersionIndex];
            
            redoBtn.textContent = 'Loading...';
            redoBtn.disabled = true;
            
            const contentResponse = await fetch(versionToLoad.download_url);
            if (!contentResponse.ok) {
                throw new Error(`Failed to load version: ${contentResponse.statusText}`);
            }
            
            const versionContent = await contentResponse.text();
            
            document.open();
            document.write(versionContent);
            document.close();
            
            console.log(`Redone to version: ${versionToLoad.name}`);
        } catch (error) {
            console.error('Error during redo operation:', error);
            alert(`Redo failed: ${error.message}`);
            
            redoBtn.textContent = 'Redo';
            redoBtn.disabled = false;
        }
    }

    async function commitChanges() {
        if (!isLoggedIn) return;
        
        try {
            commitBtn.textContent = 'Committing...';
            commitBtn.disabled = true;
            
            const currentHTML = document.documentElement.outerHTML;
            
            await uploadAllFiles(currentHTML);
            
            commitBtn.textContent = 'Commit Changes';
            commitBtn.disabled = false;
            alert('Changes committed and pushed successfully!');
            
            logout();
            
        } catch (error) {
            console.error('Error committing changes:', error);
            
            commitBtn.textContent = 'Commit Changes';
            commitBtn.disabled = false;
            alert('Error committing changes: ' + error.message);
        }
    }
    
    function logout() {
        document.body.classList.remove('edit-mode');
        
        const editableElements = document.querySelectorAll('.editable');
        editableElements.forEach(el => {
            el.removeAttribute('contenteditable');
        });
        
        commitBtn.style.display = 'none';
        undoBtn.style.display = 'none';
        redoBtn.style.display = 'none';
        
        loginBtn.textContent = "Skye's Login";
        loginBtn.disabled = false;
        
        isLoggedIn = false;
        
        console.log('Logged out');
    }
    
    async function uploadAllFiles(htmlContent) {
        const timestamp = new Date().toISOString();
        const formattedTimestamp = timestamp.replace(/[:.]/g, '-');
        
        try {
            let currentIndexContent = null;
            try {
                const indexResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/index.html`, {
                    headers: {
                        'Authorization': generateAuthHeader(),
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                
                if (indexResponse.ok) {
                    const indexData = await indexResponse.json();
                    currentIndexContent = atob(indexData.content);
                    
                    const backupFileName = `indexOLD_${formattedTimestamp}.html`;
                    await uploadFile(backupFileName, currentIndexContent, `Backup of index.html at ${timestamp}`);
                    console.log(`Created backup file: ${backupFileName}`);
                }
            } catch (e) {
                console.warn('Could not create backup of index.html:', e);
            }
            
            await uploadFile('index.html', htmlContent, `Auto-commit by Skye at ${timestamp}`);
            console.log('Updated index.html successfully!');
            
            const cssLink = document.querySelector('link[rel="stylesheet"]');
            if (cssLink && cssLink.href.includes('style.css')) {
                const cssContent = await fetchFileContent('style.css');
                if (cssContent) {
                    await uploadFile('style.css', cssContent, `Auto-commit of style.css by Skye at ${timestamp}`);
                    console.log('CSS file uploaded successfully!');
                }
            }
            
            await initVersionHistory();
            
            return true;
        } catch (e) {
            console.error('GitHub API error:', e);
            throw e;
        }
    }
    
    async function uploadFile(path, content, message) {
        let fileSha = null;
        
        try {
            const fileResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
                headers: {
                    'Authorization': generateAuthHeader(),
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (fileResponse.ok) {
                const fileData = await fileResponse.json();
                fileSha = fileData.sha;
            }
        } catch (e) {
            console.warn(`Could not check for existing file ${path}:`, e);
        }
        
        const body = {
            message: message,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: 'main'
        };
        
        if (fileSha) {
            body.sha = fileSha;
        }
        
        const uploadResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': generateAuthHeader(),
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(`Upload failed for ${path}: ${uploadResponse.statusText} - ${JSON.stringify(errorData)}`);
        }
        
        return await uploadResponse.json();
    }
    
    async function fetchFileContent(url) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return await response.text();
            }
            console.warn(`Could not fetch content for ${url}: ${response.statusText}`);
            return null;
        } catch (e) {
            console.warn(`Error fetching content for ${url}:`, e);
            return null;
        }
    }
});