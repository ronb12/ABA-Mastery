// Zero-Cost File Storage Solution for ABA Mastery
// A product of Bradley Virtual Solutions, LLC
// 100% FREE FOREVER - No cloud storage costs!

class FreeFileStorage {
    constructor() {
        this.db = firebase.firestore();
        this.maxFileSize = 1024 * 1024; // 1MB per file (Firestore-safe)
        this.maxFilesPerUser = 10;
    }

    // ============================================
    // METHOD 1: Base64 Storage in Firestore (Small Files)
    // ============================================
    // Perfect for: Notes, screenshots, small PDFs (< 1MB)
    // Cost: $0 (uses Firestore free tier: 1GB database)
    
    async uploadSmallFile(groupId, file) {
        if (file.size > this.maxFileSize) {
            throw new Error('File too large for free storage. Please use files under 1MB or share an external link.');
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const base64 = e.target.result;
                    
                    // Store in Firestore as base64
                    const fileDoc = await this.db.collection('studyGroups')
                        .doc(groupId)
                        .collection('files')
                        .add({
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            data: base64, // Stored as base64 string
                            uploadedBy: firebase.auth().currentUser.uid,
                            uploadedByName: firebase.auth().currentUser.displayName,
                            uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
                            storageMethod: 'firestore-base64'
                        });
                    
                    resolve({ success: true, fileId: fileDoc.id });
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Download small file from Firestore
    async downloadSmallFile(groupId, fileId) {
        const fileDoc = await this.db.collection('studyGroups')
            .doc(groupId)
            .collection('files')
            .doc(fileId)
            .get();
        
        if (!fileDoc.exists) {
            throw new Error('File not found');
        }
        
        const fileData = fileDoc.data();
        
        // Create download link from base64
        const link = document.createElement('a');
        link.href = fileData.data;
        link.download = fileData.name;
        link.click();
    }

    // ============================================
    // METHOD 2: External Link Sharing (Unlimited Size)
    // ============================================
    // Perfect for: Large files, videos, presentations
    // Cost: $0 (uses free external services)
    
    async shareExternalLink(groupId, linkData) {
        // User uploads to Google Drive, Dropbox, etc. and shares link
        
        await this.db.collection('studyGroups')
            .doc(groupId)
            .collection('files')
            .add({
                name: linkData.name,
                type: 'external-link',
                url: linkData.url,
                service: linkData.service, // 'google-drive', 'dropbox', 'onedrive'
                description: linkData.description || '',
                uploadedBy: firebase.auth().currentUser.uid,
                uploadedByName: firebase.auth().currentUser.displayName,
                uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
                storageMethod: 'external-link'
            });
        
        return { success: true };
    }

    // ============================================
    // METHOD 3: IndexedDB Local Storage (Offline First)
    // ============================================
    // Perfect for: Personal study materials, local caching
    // Cost: $0 (uses browser storage, unlimited)
    
    async storeInBrowser(file) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ABAMasteryFiles', 1);
            
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('files')) {
                    db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
                }
            };
            
            request.onsuccess = async (e) => {
                const db = e.target.result;
                const transaction = db.transaction(['files'], 'readwrite');
                const store = transaction.objectStore('files');
                
                const fileData = {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: await file.arrayBuffer(),
                    uploadedAt: Date.now()
                };
                
                const addRequest = store.add(fileData);
                
                addRequest.onsuccess = () => {
                    resolve({ success: true, fileId: addRequest.result });
                };
                
                addRequest.onerror = () => {
                    reject(addRequest.error);
                };
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // ============================================
    // METHOD 4: GitHub as Free CDN (Public Files)
    // ============================================
    // Perfect for: Public study guides, shared resources
    // Cost: $0 (uses GitHub free tier)
    
    generateGitHubUploadInstructions(fileName) {
        return `
            To share this file with zero cost:
            
            1. Upload to your GitHub repo: github.com/ronb12/ABA-Mastery-Files
            2. Get raw file URL: https://raw.githubusercontent.com/ronb12/ABA-Mastery-Files/main/shared/${fileName}
            3. Paste that URL in the "External Link" field
            
            This is 100% free and works forever!
        `;
    }

    // ============================================
    // SMART FILE HANDLER - Chooses Best Method
    // ============================================
    
    async uploadFile(groupId, file) {
        console.log(`📁 Uploading ${file.name} (${this.formatFileSize(file.size)})`);
        
        // Small files (< 1MB): Store in Firestore as base64
        if (file.size <= this.maxFileSize) {
            console.log('✅ Using FREE Firestore storage (base64)');
            return await this.uploadSmallFile(groupId, file);
        }
        
        // Large files: Prompt user to upload to external service
        else {
            console.log('ℹ️  File too large for free tier');
            this.showExternalLinkPrompt(groupId, file);
            return { success: false, reason: 'file-too-large' };
        }
    }

    // Show modal to guide user to upload externally
    showExternalLinkPrompt(groupId, file) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>📁 File Too Large for Free Storage</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p><strong>${file.name}</strong> is ${this.formatFileSize(file.size)}.</p>
                    <p>To keep the app 100% free, files over 1MB need to be shared via external link.</p>
                    
                    <h3>🆓 Free Options:</h3>
                    
                    <div class="external-service-option">
                        <h4>📁 Google Drive (15 GB Free)</h4>
                        <ol>
                            <li>Upload file to Google Drive</li>
                            <li>Right-click → "Get link"</li>
                            <li>Set to "Anyone with the link"</li>
                            <li>Copy link and paste below</li>
                        </ol>
                        <a href="https://drive.google.com/drive/my-drive" target="_blank" class="btn btn-primary">
                            Open Google Drive
                        </a>
                    </div>
                    
                    <div class="external-service-option">
                        <h4>📦 Dropbox (2 GB Free)</h4>
                        <ol>
                            <li>Upload file to Dropbox</li>
                            <li>Click "Share"</li>
                            <li>Copy link and paste below</li>
                        </ol>
                        <a href="https://www.dropbox.com/home" target="_blank" class="btn btn-primary">
                            Open Dropbox
                        </a>
                    </div>
                    
                    <h3>📎 Paste Your Link:</h3>
                    <input type="url" id="external-file-url" placeholder="https://drive.google.com/file/..." 
                           style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid var(--border-color); border-radius: 8px;">
                    
                    <input type="text" id="external-file-description" placeholder="File description (optional)" 
                           style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid var(--border-color); border-radius: 8px;">
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="freeFileStorage.submitExternalLink('${groupId}', '${file.name}')">
                        Share Link
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Submit external link
    async submitExternalLink(groupId, fileName) {
        const url = document.getElementById('external-file-url').value.trim();
        const description = document.getElementById('external-file-description').value.trim();
        
        if (!url) {
            alert('Please enter a file URL');
            return;
        }
        
        // Detect service from URL
        let service = 'other';
        if (url.includes('drive.google.com')) service = 'google-drive';
        else if (url.includes('dropbox.com')) service = 'dropbox';
        else if (url.includes('onedrive')) service = 'onedrive';
        else if (url.includes('github.com')) service = 'github';
        
        await this.shareExternalLink(groupId, {
            name: fileName,
            url: url,
            service: service,
            description: description
        });
        
        document.querySelector('.modal').remove();
        alert('✅ Link shared successfully!');
        
        // Reload files list
        if (typeof studyGroupsManager !== 'undefined') {
            studyGroupsManager.loadGroupFiles(groupId);
        }
    }

    // Format file size
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    // ============================================
    // DISPLAY FILES (Mixed Sources)
    // ============================================
    
    async displayGroupFiles(groupId) {
        const filesSnapshot = await this.db.collection('studyGroups')
            .doc(groupId)
            .collection('files')
            .orderBy('uploadedAt', 'desc')
            .limit(50)
            .get();

        const filesList = document.getElementById('files-list');
        if (!filesList) return;

        if (filesSnapshot.empty) {
            filesList.innerHTML = `
                <div class="empty-state">
                    <p>No files shared yet</p>
                    <p style="font-size: 14px; color: var(--text-secondary); margin-top: 10px;">
                        💡 Share files up to 1MB directly, or share links to larger files from Google Drive/Dropbox (100% FREE!)
                    </p>
                </div>
            `;
            return;
        }

        let html = '<div class="files-grid">';
        filesSnapshot.forEach(doc => {
            const file = doc.data();
            const fileIcon = this.getFileIcon(file.type);
            
            if (file.storageMethod === 'external-link') {
                // External link
                html += `
                    <div class="file-card external-link-card">
                        <div class="file-icon">${fileIcon}</div>
                        <div class="file-info">
                            <h4>${file.name}</h4>
                            <p>
                                <span class="service-badge">${this.getServiceBadge(file.service)}</span>
                                ${file.uploadedByName}
                            </p>
                            ${file.description ? `<p class="file-desc">${file.description}</p>` : ''}
                        </div>
                        <div class="file-actions">
                            <a href="${file.url}" target="_blank" class="btn btn-sm btn-primary">
                                Open Link 🔗
                            </a>
                        </div>
                    </div>
                `;
            } else {
                // Firestore base64 storage
                html += `
                    <div class="file-card">
                        <div class="file-icon">${fileIcon}</div>
                        <div class="file-info">
                            <h4>${file.name}</h4>
                            <p>${this.formatFileSize(file.size)} • ${file.uploadedByName}</p>
                            <span class="free-badge">💚 Free Storage</span>
                        </div>
                        <div class="file-actions">
                            <button class="btn btn-sm btn-primary" onclick="freeFileStorage.downloadBase64File('${groupId}', '${doc.id}')">
                                Download
                            </button>
                        </div>
                    </div>
                `;
            }
        });
        html += '</div>';
        filesList.innerHTML = html;
    }

    getFileIcon(type) {
        if (!type) return '📎';
        if (type === 'external-link') return '🔗';
        if (type.includes('pdf')) return '📄';
        if (type.includes('image')) return '🖼️';
        if (type.includes('video')) return '🎥';
        if (type.includes('word')) return '📝';
        if (type.includes('excel') || type.includes('sheet')) return '📊';
        if (type.includes('powerpoint') || type.includes('presentation')) return '📽️';
        return '📎';
    }

    getServiceBadge(service) {
        const badges = {
            'google-drive': '📁 Google Drive',
            'dropbox': '📦 Dropbox',
            'onedrive': '☁️ OneDrive',
            'github': '🐙 GitHub',
            'other': '🔗 External Link'
        };
        return badges[service] || badges.other;
    }

    async downloadBase64File(groupId, fileId) {
        const fileDoc = await this.db.collection('studyGroups')
            .doc(groupId)
            .collection('files')
            .doc(fileId)
            .get();
        
        const fileData = fileDoc.data();
        
        // Create download from base64
        const link = document.createElement('a');
        link.href = fileData.data;
        link.download = fileData.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // ============================================
    // SMART UPLOAD HANDLER
    // ============================================
    
    handleFileUpload(groupId, fileInput) {
        const file = fileInput.files[0];
        if (!file) return;

        // Check file size
        if (file.size <= this.maxFileSize) {
            // Small file: Upload to Firestore (FREE)
            console.log('💚 Uploading to FREE Firestore storage...');
            this.uploadSmallFile(groupId, file)
                .then(() => {
                    alert('✅ File uploaded successfully (FREE)!');
                    fileInput.value = '';
                    this.displayGroupFiles(groupId);
                })
                .catch(err => {
                    console.error('Upload error:', err);
                    alert('Error uploading file');
                });
        } else {
            // Large file: Show external link prompt
            console.log('📎 File too large, showing external link option...');
            this.showExternalLinkPrompt(groupId, file);
        }
    }
}

// ============================================
// ENHANCED UI FOR FREE STORAGE
// ============================================

function showFreeFileUploadUI(groupId) {
    return `
        <div class="file-upload-section free-storage">
            <h3>📁 Share Files (100% FREE Forever)</h3>
            
            <div class="upload-options">
                <div class="upload-option">
                    <h4>💚 Small Files (Under 1MB)</h4>
                    <p>Notes, screenshots, small PDFs - upload directly</p>
                    <input type="file" id="small-file-input" style="display: none;" 
                           onchange="freeFileStorage.handleFileUpload('${groupId}', this)">
                    <button class="btn btn-primary" onclick="document.getElementById('small-file-input').click()">
                        📤 Upload Small File
                    </button>
                </div>
                
                <div class="upload-option">
                    <h4>🔗 Large Files (Any Size)</h4>
                    <p>Upload to Google Drive/Dropbox first, then share link here</p>
                    <button class="btn btn-secondary" onclick="freeFileStorage.showExternalLinkPrompt('${groupId}', {})">
                        📎 Share External Link
                    </button>
                </div>
            </div>
            
            <div class="free-storage-info">
                <p>💡 <strong>Smart FREE Storage:</strong></p>
                <ul>
                    <li>Files under 1MB: Stored directly (zero cost)</li>
                    <li>Files over 1MB: Share via Google Drive/Dropbox (zero cost)</li>
                    <li>No limits, no fees, works forever!</li>
                </ul>
            </div>
        </div>
    `;
}

// Initialize
const freeFileStorage = new FreeFileStorage();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FreeFileStorage, freeFileStorage };
}

