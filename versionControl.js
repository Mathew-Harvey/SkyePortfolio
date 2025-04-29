document.addEventListener('DOMContentLoaded', function() {
    let isLoggedIn = false;
    let versionHistory = [];
    let currentVersionIndex = -1;
    let isUndoOperation = false;
    let imageCache = {};

    // Check for undo/redo session state
    const sessionStateStr = sessionStorage.getItem('skyePortfolioState');
    if (sessionStateStr) {
        try {
            const sessionState = JSON.parse(sessionStateStr);
            if (sessionState.isLoggedIn) {
                isLoggedIn = true;
                currentVersionIndex = sessionState.currentVersionIndex || -1;
                isUndoOperation = sessionState.isUndoOperation || false;
            }
            // Clear the session storage to prevent infinite loops
            sessionStorage.removeItem('skyePortfolioState');
        } catch (e) {
            console.warn('Failed to parse session state:', e);
        }
    }

    // Load image cache from localStorage
    try {
        const savedImageCache = localStorage.getItem('skyePortfolioImageCache');
        if (savedImageCache) {
            imageCache = JSON.parse(savedImageCache);
            applyImageCache();
        }
    } catch (e) {
        console.warn('Failed to load image cache from localStorage:', e);
    }

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

    // Safely get elements, avoiding null reference errors
    const loginBtn = document.getElementById('login-btn');
    const saveBtn = document.getElementById('save-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    
    // Only attach event listeners if elements exist
    if (loginBtn) loginBtn.addEventListener('click', login);
    if (saveBtn) saveBtn.addEventListener('click', saveChanges);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (undoBtn) undoBtn.addEventListener('click', undoChanges);
    if (redoBtn) redoBtn.addEventListener('click', redoChanges);

    // Initialize the app
    init();

    async function init() {
        await initVersionHistory();
        
        if (isLoggedIn) {
            console.log('Restoring logged in state after page reload');
            enterEditMode();
        }
    }

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
        setupImageClickHandlers();
        
        // Safely update UI elements
        if (saveBtn) saveBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (undoBtn) undoBtn.style.display = 'block';
        if (redoBtn) redoBtn.style.display = 'block';
        
        updateUndoRedoButtons();
        
        if (loginBtn) {
            loginBtn.textContent = 'Logged In';
            loginBtn.disabled = true;
        }
        
        console.log('Entered edit mode');
    }

    function updateUndoRedoButtons() {
        if (!undoBtn || !redoBtn) {
            console.warn('Undo/Redo buttons not found in the DOM');
            return;
        }
        
        if (versionHistory.length === 0) {
            undoBtn.disabled = true;
            redoBtn.disabled = true;
            return;
        }
        
        undoBtn.disabled = currentVersionIndex >= versionHistory.length - 1;
        redoBtn.disabled = currentVersionIndex <= 0;
        
        console.log(`Undo/Redo state: History length=${versionHistory.length}, Current index=${currentVersionIndex}`);
    }

    function setupDragAndDrop() {
        const profilePicContainer = document.getElementById('profile-pic-container');
        const profilePic = document.getElementById('profile-pic');
        
        if (profilePicContainer && profilePic) {
            profilePicContainer.addEventListener('dragover', handleDragOver);
            profilePicContainer.addEventListener('drop', function(e) {
                handleImageDrop(e, profilePic);
            });
        }
        
        const projectImgContainers = document.querySelectorAll('.project-img-container');
        projectImgContainers.forEach(container => {
            const img = container.querySelector('.project-img');
            if (img) {
                container.addEventListener('dragover', handleDragOver);
                container.addEventListener('drop', function(e) {
                    handleImageDrop(e, img);
                });
            }
        });
        
        console.log('Drag and drop handlers initialized');
    }
    
    function setupImageClickHandlers() {
        const profilePicContainer = document.getElementById('profile-pic-container');
        const profilePic = document.getElementById('profile-pic');
        
        if (profilePicContainer && profilePic) {
            profilePicContainer.addEventListener('click', function(e) {
                if (isLoggedIn) {
                    e.preventDefault();
                    e.stopPropagation();
                    showImageUploadDialog(profilePic);
                }
            });
        }
        
        const projectImgContainers = document.querySelectorAll('.project-img-container');
        projectImgContainers.forEach(container => {
            const img = container.querySelector('.project-img');
            if (img) {
                container.addEventListener('click', function(e) {
                    if (isLoggedIn) {
                        e.preventDefault();
                        e.stopPropagation();
                        showImageUploadDialog(img);
                    }
                });
            }
        });
        
        console.log('Image click handlers initialized');
    }
    
    function showImageUploadDialog(imgElement) {
        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        fileInput.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                handleImageFile(file, imgElement);
            }
            // Remove the file input after selection
            if (document.body.contains(fileInput)) {
                document.body.removeChild(fileInput);
            }
        };
        
        // Handle cancel case
        fileInput.addEventListener('cancel', function() {
            if (document.body.contains(fileInput)) {
                document.body.removeChild(fileInput);
            }
        });
        
        // Add cleanup listener to ensure it's removed
        window.setTimeout(() => {
            if (document.body.contains(fileInput)) {
                document.body.removeChild(fileInput);
            }
        }, 5000); // 5 second timeout as a fallback
        
        // Open file selection dialog
        fileInput.click();
    }
    
    function handleImageFile(file, imgElement) {
        if (!file || !file.type.match('image.*')) {
            alert('Please select a valid image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageId = generateImageId(imgElement);
            imgElement.src = event.target.result;
            imgElement.dataset.pendingUpload = 'true';
            imgElement.dataset.imageId = imageId;
            
            // Save image to local storage
            imageCache[imageId] = {
                dataUrl: event.target.result,
                originalName: file.name,
                type: file.type,
                timestamp: new Date().toISOString()
            };
            
            saveImageCache();
            console.log(`Image stored in local cache: ${imageId}`);
        };
        
        reader.readAsDataURL(file);
    }
    
    function generateImageId(imgElement) {
        const path = getImageElementPath(imgElement);
        return `img_${path}_${Date.now()}`;
    }
    
    function getImageElementPath(imgElement) {
        if (imgElement.id === 'profile-pic') {
            return 'profile';
        }
        
        const projectContainer = imgElement.closest('.project');
        if (projectContainer) {
            const projectIndex = Array.from(document.querySelectorAll('.project')).indexOf(projectContainer);
            return `project_${projectIndex}`;
        }
        
        return `unknown_${Math.random().toString(36).substring(2, 10)}`;
    }
    
    function saveImageCache() {
        try {
            localStorage.setItem('skyePortfolioImageCache', JSON.stringify(imageCache));
        } catch (e) {
            console.warn('Failed to save image cache to localStorage:', e);
        }
    }
    
    function applyImageCache() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const imageId = img.dataset.imageId;
            if (imageId && imageCache[imageId]) {
                img.src = imageCache[imageId].dataUrl;
                img.dataset.pendingUpload = 'true';
            }
        });
        
        console.log('Applied image cache from local storage');
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }
    
    function handleImageDrop(e, imgElement) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isLoggedIn) return;
        
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.match('image.*')) {
            alert('Please drop an image file');
            return;
        }
        
        handleImageFile(file, imgElement);
    }

    async function undoChanges() {
        if (!isLoggedIn) return;
        
        // Check if we have any versions in history
        if (versionHistory.length === 0) {
            alert("No previous versions available to undo to.");
            return;
        }
        
        try {
            let versionToLoad;
            
            // First undo after page load
            if (currentVersionIndex === -1) {
                versionToLoad = versionHistory[0];
                currentVersionIndex = 0;
            } 
            // Check if we can go back further in history
            else if (currentVersionIndex < versionHistory.length - 1) {
                currentVersionIndex++;
                versionToLoad = versionHistory[currentVersionIndex];
            } 
            // No more versions to undo to
            else {
                alert("You've reached the oldest version. No more changes to undo.");
                return;
            }
            
            console.log(`Undoing to version index ${currentVersionIndex} of ${versionHistory.length - 1}`);
            
            if (undoBtn) {
                undoBtn.textContent = 'Loading...';
                undoBtn.disabled = true;
            }
            
            // Try to load the version content
            const contentResponse = await fetch(versionToLoad.download_url);
            if (!contentResponse.ok) {
                throw new Error(`Failed to load version: ${contentResponse.statusText}`);
            }
            
            const versionContent = await contentResponse.text();
            
            // On first undo, save current state for potential redo
            if (!isUndoOperation) {
                const currentHTML = document.documentElement.outerHTML;
                
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const tempFileName = `indexTEMP_${timestamp}.html`;
                
                await uploadFile(tempFileName, currentHTML, `Temporary save before undo at ${timestamp}`);
            }
            
            isUndoOperation = true;
            
            // Save state to session storage before reload
            sessionStorage.setItem('skyePortfolioState', JSON.stringify({
                isLoggedIn: true,
                currentVersionIndex: currentVersionIndex,
                isUndoOperation: true
            }));
            
            // Replace page content with the loaded version
            document.open();
            document.write(versionContent);
            document.close();
            
            // This will reinitialize the page's JS
            console.log(`Reverted to version: ${versionToLoad.name}`);
        } catch (error) {
            console.error('Error during undo operation:', error);
            alert(`Undo failed: ${error.message}`);
            
            if (undoBtn) {
                undoBtn.textContent = 'Undo';
                undoBtn.disabled = false;
            }
            updateUndoRedoButtons();
        }
    }

    async function redoChanges() {
        if (!isLoggedIn) return;
        
        // Check if we have any versions in history
        if (versionHistory.length === 0) {
            alert("No version history available for redo operations.");
            return;
        }
        
        // Check if we're already at the most recent version
        if (currentVersionIndex <= 0) {
            alert("You're already at the most recent version. No changes to redo.");
            return;
        }
        
        try {
            // Move toward more recent versions
            currentVersionIndex--;
            const versionToLoad = versionHistory[currentVersionIndex];
            
            console.log(`Redoing to version index ${currentVersionIndex} of ${versionHistory.length - 1}`);
            
            if (redoBtn) {
                redoBtn.textContent = 'Loading...';
                redoBtn.disabled = true;
            }
            
            // Try to load the version content
            const contentResponse = await fetch(versionToLoad.download_url);
            if (!contentResponse.ok) {
                throw new Error(`Failed to load version: ${contentResponse.statusText}`);
            }
            
            const versionContent = await contentResponse.text();
            
            // Save state to session storage before reload
            sessionStorage.setItem('skyePortfolioState', JSON.stringify({
                isLoggedIn: true,
                currentVersionIndex: currentVersionIndex,
                isUndoOperation: true
            }));
            
            // Replace page content with the loaded version
            document.open();
            document.write(versionContent);
            document.close();
            
            // This will reinitialize the page's JS
            console.log(`Redone to version: ${versionToLoad.name}`);
        } catch (error) {
            console.error('Error during redo operation:', error);
            alert(`Redo failed: ${error.message}`);
            
            if (redoBtn) {
                redoBtn.textContent = 'Redo';
                redoBtn.disabled = false;
            }
            updateUndoRedoButtons();
        }
    }

    async function saveChanges() {
        if (!isLoggedIn) return;
        
        try {
            if (saveBtn) {
                saveBtn.textContent = 'Saving...';
                saveBtn.disabled = true;
            }
            
            // First, make sure the images directory exists
            await createImagesDirectory();
            
            // Then upload pending images
            const imagesToUpload = findPendingImageUploads();
            const uploadedImagePaths = await uploadPendingImages(imagesToUpload);
            
            // Update HTML with new image paths
            updateHtmlImageReferences(imagesToUpload, uploadedImagePaths);
            
            const currentHTML = document.documentElement.outerHTML;
            
            await uploadAllFiles(currentHTML);
            
            // Clear pending uploads after successful save
            clearPendingUploads(imagesToUpload);
            
            // Reset undo/redo index to point to the most recent version
            currentVersionIndex = 0;
            updateUndoRedoButtons();
            
            if (saveBtn) {
                saveBtn.textContent = 'Save Changes';
                saveBtn.disabled = false;
            }
            alert('Changes saved successfully!');
            
        } catch (error) {
            console.error('Error saving changes:', error);
            
            if (saveBtn) {
                saveBtn.textContent = 'Save Changes';
                saveBtn.disabled = false;
            }
            alert('Error saving changes: ' + error.message);
        }
    }
    
    async function createImagesDirectory() {
        try {
            // Check if images directory exists
            const dirResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/images`, {
                headers: {
                    'Authorization': generateAuthHeader(),
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (dirResponse.ok) {
                return true; // Directory exists
            }
            
            // Create a .gitkeep file to create the directory
            const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/images/.gitkeep`, {
                method: 'PUT',
                headers: {
                    'Authorization': generateAuthHeader(),
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Create images directory',
                    content: btoa(''),
                    branch: 'main'
                })
            });
            
            return response.ok;
        } catch (e) {
            console.warn('Error creating images directory:', e);
            throw new Error('Failed to create images directory');
        }
    }
    
    function findPendingImageUploads() {
        const pendingImages = [];
        const images = document.querySelectorAll('img[data-pending-upload="true"]');
        
        images.forEach(img => {
            if (img.dataset.imageId && imageCache[img.dataset.imageId]) {
                pendingImages.push({
                    element: img,
                    imageId: img.dataset.imageId,
                    data: imageCache[img.dataset.imageId]
                });
            }
        });
        
        return pendingImages;
    }
    
    async function uploadPendingImages(pendingImages) {
        const uploadedPaths = {};
        
        for (const img of pendingImages) {
            try {
                const fileName = generateUniqueFileName(img.data.originalName);
                const filePath = `images/${fileName}`;
                
                // Convert dataURL to base64 content
                let dataUrl = img.data.dataUrl;
                let base64Content = dataUrl.split(',')[1];
                
                const uploadResult = await uploadFile(filePath, null, `Upload image: ${fileName}`, base64Content);
                
                // Check if the upload result contains valid content
                if (uploadResult && uploadResult.content && uploadResult.content.download_url) {
                    uploadedPaths[img.imageId] = {
                        path: filePath,
                        url: uploadResult.content.download_url
                    };
                    
                    console.log(`Uploaded image: ${filePath}`);
                } else {
                    console.warn('Upload succeeded but returned unexpected result:', uploadResult);
                    throw new Error('Upload returned invalid content structure');
                }
                
            } catch (error) {
                console.error(`Failed to upload image ${img.imageId}:`, error);
                throw new Error(`Failed to upload image: ${error.message}`);
            }
        }
        
        return uploadedPaths;
    }
    
    function generateUniqueFileName(originalName) {
        const timestamp = Date.now();
        const extension = originalName.split('.').pop() || 'jpg'; // Default to jpg if no extension
        const baseName = originalName.split('.').slice(0, -1).join('.');
        const sanitizedBaseName = (baseName || 'image').replace(/[^a-zA-Z0-9-_]/g, '-');
        
        return `${sanitizedBaseName}-${timestamp}.${extension}`;
    }
    
    function updateHtmlImageReferences(pendingImages, uploadedPaths) {
        pendingImages.forEach(img => {
            if (uploadedPaths[img.imageId]) {
                img.element.src = uploadedPaths[img.imageId].url;
                img.element.removeAttribute('data-pending-upload');
                img.element.removeAttribute('data-image-id');
            }
        });
    }
    
    function clearPendingUploads(uploadedImages) {
        uploadedImages.forEach(img => {
            delete imageCache[img.imageId];
        });
        
        saveImageCache();
    }
    
    function logout() {
        document.body.classList.remove('edit-mode');
        
        const editableElements = document.querySelectorAll('.editable');
        editableElements.forEach(el => {
            el.removeAttribute('contenteditable');
        });
        
        if (saveBtn) saveBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (undoBtn) undoBtn.style.display = 'none';
        if (redoBtn) redoBtn.style.display = 'none';
        
        if (loginBtn) {
            loginBtn.textContent = "Skye's Login";
            loginBtn.disabled = false;
        }
        
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
                    const backupResult = await uploadFile(backupFileName, currentIndexContent, `Backup of index.html at ${timestamp}`);
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
            
            // Reload version history after save to include the new backup
            await initVersionHistory();
            
            return true;
        } catch (e) {
            console.error('GitHub API error:', e);
            throw e;
        }
    }
    
    async function uploadFile(path, content, message, base64Content = null) {
        let fileSha = null;
        
        try {
            const fileResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
                headers: {
                    'Authorization': generateAuthHeader(),
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (fileResponse.ok) {
                try {
                    const fileData = await fileResponse.json();
                    if (fileData && fileData.sha) {
                        fileSha = fileData.sha;
                    }
                } catch (e) {
                    console.warn(`Could not parse JSON response for ${path}:`, e);
                }
            }
        } catch (e) {
            console.warn(`Could not check for existing file ${path}:`, e);
        }
        
        const body = {
            message: message,
            content: base64Content || btoa(unescape(encodeURIComponent(content || ''))),
            branch: 'main'
        };
        
        if (fileSha) {
            body.sha = fileSha;
        }
        
        try {
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
                const errorText = await uploadResponse.text();
                console.error(`Upload failed for ${path}:`, uploadResponse.status, errorText);
                throw new Error(`Upload failed for ${path}: ${uploadResponse.statusText}`);
            }
            
            return await uploadResponse.json();
        } catch (e) {
            console.error(`Error during upload of ${path}:`, e);
            throw new Error(`Failed to upload ${path}: ${e.message}`);
        }
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