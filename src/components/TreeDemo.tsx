import { useState, useEffect, useRef, useCallback, useMemo, ChangeEvent } from 'react';
import { Tree } from 'primereact/tree';
import { ContextMenu } from 'primereact/contextmenu';
import { MenuItem } from 'primereact/menuitem';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import httpClient from "../utils/htttpClient";
import { Terminal } from 'primereact/terminal';
import { TerminalService } from 'primereact/terminalservice';
import './style.css';

interface TreeNode {
    key: string;
    label: string;
    data?: string;
    icon?: string;
    children?: TreeNode[];
}

interface PersistedNode {
    key: string;
    label: string;
    type: 'folder' | 'file';
    parentKey?: string;
}

const STORE_NAME = "documents";

export const TreeDemo = () => {

    const commandHandler = async (text: any) => {
        let response = await httpClient.postMethod('linux/execute', { command: text });

        switch (text) {
     
            case 'clear':
                response = null;
                break;
            case 'sudo su':
                setPrompt('root $');
                break;
        }

        if (response) {
            TerminalService.emit('response', response);
        }
        else {
            TerminalService.emit('clear');
        }
    }

    useEffect(() => {
        TerminalService.on('command', commandHandler);
        return () => {
            TerminalService.off('command', commandHandler);
        }
    }, [])


    const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
    const [selectedTreeNodeKeys, setSelectedTreeNodeKeys] = useState<string | { [key: string]: boolean } | null>(null);
    const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
    const [currentFileContent, setCurrentFileContent] = useState<any>('');
    const [addDialog, setAddDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [newNodeName, setNewNodeName] = useState('');
    const [newNodeType, setNewNodeType] = useState<'folder' | 'file'>('folder');
    const [editNodeName, setEditNodeName] = useState('');
    const contextMenu = useRef<any>(null);
    const pendingContextMenuEvent = useRef<any>(null);
    const toast = useRef<any>(null);
    const [contextMenuType, setContextMenuType] = useState<'folder' | 'file'>('folder');
    const [itemDocuments, setItemDocuments] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const uploadTargetKeyRef = useRef<string | null>(null);
    const [terminalVisible, setTerminalVisible] = useState<boolean>(false);
    const [terminalCollapsed, setTerminalCollapsed] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>("Jarvis $");
    const [resultDialog, setResultDialog] = useState(false);
    const [resultContent, setResultContent] = useState<string>('');
    const keyRoot: any = localStorage.getItem('rootFolder');

    const getTree = async () => {

            let items = await httpClient.getMethod("file/scan?filepath=" + encodeURIComponent(keyRoot || ''));

            setItemDocuments(items);

            let dataTree = buildTreeFromItems(items as PersistedNode[]);

            setTreeNodes(dataTree);
    }

    useEffect(() => {
        getTree();
    }, []);

    const buildTreeFromItems = (items: PersistedNode[]): TreeNode[] => {
        const rootNode: TreeNode = {
            key: keyRoot,
            label: "Tài liệu",
            data: "RootFolder",
            icon: "pi pi-home",
            children: []
        };

        const nodeMap = new Map<string, TreeNode>();

        items.forEach(item => {
            nodeMap.set(item.key, {
                key: item.key,
                label: item.label,
                data: item.type === 'folder' ? `${item.label} Folder` : `${item.label} File`,
                icon: item.type === 'folder' ? 'pi pi-fw pi-folder' : 'pi pi-fw pi-file',
                children: item.type === 'folder' ? [] : undefined
            });
        });

        items.forEach(item => {
            const node = nodeMap.get(item.key);
            if (!node) return;

            if (!item.parentKey || item.parentKey === keyRoot) {
                rootNode.children?.push(node);
                return;
            }

            const parentNode = nodeMap.get(item.parentKey);
            if (parentNode) {
                if (!parentNode.children) {
                    parentNode.children = [];
                }
                parentNode.children.push(node);
            }
        });

        return [rootNode];
    };

    // Helper function to find node by key
    const findNodeByKey = (nodes: TreeNode[], key: string): TreeNode | null => {
        for (const node of nodes) {
            if (node.key === key) {
                return node;
            }
            if (node.children) {
                const found = findNodeByKey(node.children, key);
                if (found) return found;
            }
        }
        return null;
    };

    const getSelectedKey = (): string => {
        if (!selectedTreeNodeKeys) {
            return '';
        }

        return typeof selectedTreeNodeKeys === 'string'
            ? selectedTreeNodeKeys
            : Object.keys(selectedTreeNodeKeys)[0];
    };

    const findLabelPathByKey = (nodes: TreeNode[], key: string, currentPath: string[] = []): string[] | null => {
        for (const node of nodes) {
            const newPath = [...currentPath, node.label];
            if (node.key === key) {
                return newPath;
            }
            if (node.children) {
                const childPath = findLabelPathByKey(node.children, key, newPath);
                if (childPath) {
                    return childPath;
                }
            }
        }
        return null;
    };

    const getSelectedFullPath = (targetKey?: string): any => {
        const selectedKey = targetKey ?? getSelectedKey();
        if (!selectedKey) {
            return null;
        }

        if (selectedKey === keyRoot) {
            return keyRoot;
        }

        const segments: string[] = [];
        let currentItem: any | undefined = itemDocuments.find(m => m.key === selectedKey);

        while (currentItem) {
            segments.push(currentItem.label);

            if (!currentItem.parentKey || currentItem.parentKey === keyRoot) {
                break;
            }

            currentItem = itemDocuments.find(m => m.key === currentItem.parentKey);
        }

        if (segments.length === 0) {
            const labelPath = findLabelPathByKey(treeNodes, selectedKey);
            if (labelPath && labelPath.length > 1) {
                return [STORE_NAME, ...labelPath.slice(1)].join('.');
            }
            return STORE_NAME;
        }

        // Thêm tên store "documents" ở đầu cho đúng format ví dụ
        segments.push(STORE_NAME);

        return segments.reverse().join('.');
    };

    // Helper function to update tree nodes
    const updateTreeNodes = (nodes: TreeNode[], key: string, updateFn: (node: TreeNode) => TreeNode): TreeNode[] => {
        return nodes.map(node => {
            if (node.key === key) {
                return updateFn(node);
            }
            if (node.children) {
                return {
                    ...node,
                    children: updateTreeNodes(node.children, key, updateFn)
                };
            }
            return node;
        });
    };

    // Helper function to remove node by key
    const removeNodeByKey = (nodes: TreeNode[], key: string): TreeNode[] => {
        return nodes.filter(node => {
            if (node.key === key) {
                return false;
            }
            if (node.children) {
                node.children = removeNodeByKey(node.children, key);
            }
            return true;
        });
    };
    
    // Helper function to add node to tree structure
    const addNodeToTree = (nodes: TreeNode[], parentKey: string, node: TreeNode): TreeNode[] => {
        return nodes.map(n => {
            if (n.key === parentKey) {
                return {
                    ...n,
                    children: [...(n.children || []), node]
                };
            }
            if (n.children) {
                return {
                    ...n,
                    children: addNodeToTree(n.children, parentKey, node)
                };
            }
            return n;
        });
    };

    // Handle node click - show file content if it's a file
    const handleNodeClick = useCallback(() => {
        const selectedKey = getSelectedKey();
        if (!selectedKey) {
            setSelectedNode(null);
            setCurrentFileContent('');
            return;
        }

        const node = findNodeByKey(treeNodes, selectedKey);
        if (!node) {
            setSelectedNode(null);
            setCurrentFileContent('');
            return;
        }

        setSelectedNode(node);

        const item = itemDocuments.find(m => m.key === selectedKey);
        const isFile = !node.children || item?.type === 'file';
        if (!isFile) {
            setCurrentFileContent('');
            return;
        }

        const fullPath = getSelectedFullPath();
        if (!fullPath) {
            setCurrentFileContent('');
            return;
        }

        (async () => {
            var param = encodeURIComponent(item.key || '');

            let content = await httpClient.getMethod(`file/download-text?filepath=${param}`);

            setCurrentFileContent(content);
        })();
    }, [selectedTreeNodeKeys, treeNodes, itemDocuments]);


    // Handle add node
    const handleAddNode = () => {
        if (!newNodeName.trim()) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập tên', life: 3000 });
            return;
        }

        const selectedKey = getSelectedKey();
        if (!selectedKey) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn một thư mục để thêm vào', life: 3000 });
            return;
        }

        const parentNode = findNodeByKey(treeNodes, selectedKey);
        if (!parentNode) {
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không tìm thấy thư mục cha', life: 3000 });
            return;
        }

        // Check if parent is a file (can't add children to files)
        const isParentFile = !parentNode.children && (parentNode.icon === 'pi pi-fw pi-file' || !parentNode.icon || parentNode.icon.includes('file'));
        if (isParentFile) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Không thể thêm vào file. Vui lòng chọn thư mục', life: 3000 });
            return;
        }

        const newKey = `${selectedKey}-${Date.now()}`;
        const newNode: TreeNode = {
            key: newKey,
            label: newNodeName,
            data: newNodeType === 'folder' ? `${newNodeName} Folder` : `${newNodeName} File`,
            icon: newNodeType === 'folder' ? 'pi pi-fw pi-folder' : 'pi pi-fw pi-file',
            children: newNodeType === 'folder' ? [] : undefined
        };

        const newNodeData: any = {
            key: newKey,
            label: newNodeName,
            type: newNodeType,
            parentKey: selectedKey,
        };

        httpClient.postMethod(`file/add`, newNodeData);

        setTreeNodes(prevNodes => {
            return updateTreeNodes(prevNodes, selectedKey, (node) => {
                return {
                    ...node,
                    children: [...(node.children || []), newNode]
                };
            });
        });

        setNewNodeName('');
        setAddDialog(false);

        setTimeout(() => {
            getTree();
        }, 1000);

        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: `Đã thêm ${newNodeType === 'folder' ? 'thư mục' : 'file'}`, life: 3000 });
    };

    // Handle edit node
    const handleEditNode = () => {
        if (!editNodeName.trim()) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập tên mới', life: 3000 });
            return;
        }

        const selectedKey = getSelectedKey();
        if (!selectedKey) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn một node để sửa', life: 3000 });
            return;
        }

        setTreeNodes(prevNodes => {
            return updateTreeNodes(prevNodes, selectedKey, (node) => {
                return {
                    ...node,
                    label: editNodeName,
                    data: node.children ? `${editNodeName} Folder` : `${editNodeName} File`
                };
            });
        });

        let item = itemDocuments.find(m => m.key === selectedKey);

        item.label = editNodeName;

        httpClient.postMethod(`file/update`, item);

        setEditNodeName('');

        setEditDialog(false);
        
        setTimeout(() => {
            getTree();
        }, 1000);

        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật tên', life: 3000 });
    };

    const handleDeleteNode = () => {
        const selectedKey = getSelectedKey();
        if (!selectedKey) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn một node để xóa', life: 3000 });
            return;
        }

        const node = findNodeByKey(treeNodes, selectedKey);
        if (!node) {
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không tìm thấy node', life: 3000 });
            return;
        }

        // Remove node and all its children
        setTreeNodes(prevNodes => removeNodeByKey(prevNodes, selectedKey));

        // Remove file content if it's a file
        if (!node.children) {

        } else {
            // Remove all file contents for children recursively
            const removeChildrenContents = (node: TreeNode) => {
                if (!node.children) {

                } else {
                    node.children.forEach((child: TreeNode) => removeChildrenContents(child));
                }
            };
            removeChildrenContents(node);
        }

        let item = itemDocuments.find(m => m.key === selectedKey);

        httpClient.postMethod(`file/delete`, item);

        setSelectedTreeNodeKeys(null);
        setSelectedNode(null);
        setCurrentFileContent('');
        setTimeout(() => {
            getTree();
        }, 1000);
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa node', life: 3000 });
    };

    // Handle context menu
    const handleContextMenu = (e: any) => {
        e.preventDefault();
        if (typeof e.persist === 'function') {
            e.persist();
        }

        const selectedKey = getSelectedKey();
        const node = selectedKey ? findNodeByKey(treeNodes, selectedKey) : null;
        const isFileNode = node ? !node.children : false;
        const targetMenuType: 'folder' | 'file' = isFileNode ? 'file' : 'folder';

        if (targetMenuType !== contextMenuType) {
            pendingContextMenuEvent.current = e;
            setContextMenuType(targetMenuType);
            return;
        }

        contextMenu.current?.show(e);
    };

    useEffect(() => {
        if (pendingContextMenuEvent.current) {
            contextMenu.current?.show(pendingContextMenuEvent.current);
            pendingContextMenuEvent.current = null;
        }
    }, [contextMenuType]);

    // Open add dialog
    const openAddDialog = () => {
        const selectedKey = getSelectedKey();
        if (!selectedKey) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn một thư mục để thêm vào', life: 3000 });
            return;
        }
        setNewNodeName('');
        setAddDialog(true);
    };

    // Open edit dialog
    const openEditDialog = () => {
        const selectedKey = getSelectedKey();
        if (!selectedKey) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn một node để sửa', life: 3000 });
            return;
        }
        const node = findNodeByKey(treeNodes, selectedKey);
        if (node) {
            setEditNodeName(node.label);
            setEditDialog(true);
        }
    };

    const confirmDelete = () => {
        const selectedKey = getSelectedKey();
        if (!selectedKey) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn một node để xóa', life: 3000 });
            return;
        }
        const node = findNodeByKey(treeNodes, selectedKey);
        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa "${node?.label}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            accept: handleDeleteNode
        });
    };

    const confirmRun = async () => {
        const selectedKey = getSelectedKey();
        if (!selectedKey) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn một node để xóa', life: 3000 });
            return;
        }
        const node = findNodeByKey(treeNodes, selectedKey);
     
        if(node) {
            if(node.key.endsWith('.sh')){
                let response = await httpClient.postMethod('linux/execute', { command: `bash ${node.key}` });

                if (response) {
                    setResultContent(response);
                    setResultDialog(true);
                }
            }
            else if(node.key.endsWith('.py')){
                let response = await httpClient.postMethod('linux/execute', { command: `python3 ${node.key}` });

                if (response) {
                    setResultContent(response);
                    setResultDialog(true);
                }
            }
            else if(node.key.endsWith('.js')){
                let response = await httpClient.postMethod('linux/execute', { command: `node ${node.key}` });

                if (response) {
                    setResultContent(response);
                    setResultDialog(true);
                }
            }
            else
            {
                toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Chỉ có thể chạy file .sh', life: 3000 });
            }
        }

     
    };

    // Save file content
    const handleSaveFileContent = () => {
        const selectedKey = getSelectedKey();
        if (selectedKey) {

            const item = itemDocuments.find(m => m.key === selectedKey);

            httpClient.uploadFile("file/upload", item.parentKey, item.label, currentFileContent);

            setTimeout(() => {
                getTree();
            }, 1000);

            toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đã lưu nội dung file', life: 3000 });
        }
    };

    const handleUploadFileMenuClick = useCallback(() => {
        const selectedKey = getSelectedKey();
        if (!selectedKey) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn thư mục để upload', life: 3000 });
            return;
        }

        const node = findNodeByKey(treeNodes, selectedKey);
        const isFolder = !!node?.children;

        if (!isFolder) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Chỉ có thể upload vào thư mục', life: 3000 });
            return;
        }

        uploadTargetKeyRef.current = selectedKey;
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    }, [treeNodes, selectedTreeNodeKeys]);

    const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const parentKey = uploadTargetKeyRef.current || getSelectedKey();
        uploadTargetKeyRef.current = null;

        if (!parentKey) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Không xác định được thư mục cần upload', life: 3000 });
            event.target.value = '';
            return;
        }

        const parentNode = findNodeByKey(treeNodes, parentKey);
        const isFolder = !!parentNode?.children;

        if (!isFolder) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Chỉ có thể upload vào thư mục', life: 3000 });
            event.target.value = '';
            return;
        }

        try {
            await httpClient.uploadFile("file/upload", parentKey, file.name, file);

            const newNodeData = {
                key: parentKey + '-' + file.name,
                label: file.name,
                type: 'file',
                parentKey
            };

            const newNode: TreeNode = {
                key: parentKey + '-' + file.name,
                label: file.name,
                data: `${file.name} File`,
                icon: 'pi pi-fw pi-file'
            };

            setTreeNodes(prevNodes => {
                return updateTreeNodes(prevNodes, parentKey, (node) => ({
                    ...node,
                    children: [...(node.children || []), newNode]
                }));
            });

            setItemDocuments(prev => [...prev, newNodeData]);

            setTimeout(() => {
                getTree();
            }, 1000);

            toast.current?.show({ severity: 'success', summary: 'Thành công', detail: `Đã upload "${file.name}"`, life: 3000 });
        } catch (error) {
            console.error(error);
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Upload thất bại', life: 3000 });
        } finally {
            event.target.value = '';
        }
    };

    // Context menu items
    const contextMenuItems = useMemo<MenuItem[]>(() => {
        const additionItems: MenuItem[] = [
            {
                label: 'Thêm thư mục',
                icon: 'pi pi-envelope',
                command: () => {
                    setNewNodeType('folder');
                    openAddDialog();
                }
            },
            {
                label: 'Thêm file',
                icon: 'pi pi-plus-circle',
                command: () => {
                    setNewNodeType('file');
                    openAddDialog();
                }
            },
            {
                label: 'Size',
                icon: 'pi pi-exclamation-circle',
                command: async () => {
                    const selectedKey = getSelectedKey();

                    if (selectedKey) {

                        const item = itemDocuments.find(m => m.key === selectedKey);

                        let response = await httpClient.getMethod("file/size?param=" + encodeURIComponent(item.key || ''));

                        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: response.content, life: 3000 });
                    }
                }
            },
            {
                label: 'Upload file',
                icon: 'pi pi-upload',
                command: () => {
                    handleUploadFileMenuClick();
                }
            }
        ];

        const actionItems: MenuItem[] = [
            {
                label: 'Chạy',
                icon: 'pi pi-forward',
                command: confirmRun
            },
            {
                label: 'Sửa',
                icon: 'pi pi-pencil',
                command: openEditDialog
            },
            {
                label: 'Xóa',
                icon: 'pi pi-trash',
                command: confirmDelete
            },
            {
                label: 'Download file',
                icon: 'pi pi-download',
                command: async () => {
                    const selectedKey = getSelectedKey();

                    if (selectedKey) {

                        const item = itemDocuments.find(m => m.key === selectedKey);

                        let response = await httpClient.getFile("file/download?filepath=" + encodeURIComponent(item.key || ''));
                        const blob = new Blob([response], { type: 'application/octet-stream' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = item.label;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                    }
                }
            }
          
        ];

        return contextMenuType === 'file' ? actionItems : [...additionItems, ...actionItems];
    }, [contextMenuType, openAddDialog, openEditDialog, confirmDelete, handleUploadFileMenuClick]);

    // Custom node template with drag and drop support
 
    // Update selected node when selection changes
    useEffect(() => {
        handleNodeClick();
    }, [handleNodeClick]);

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <ContextMenu model={contextMenuItems} ref={contextMenu} />
            <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
            />

            <div className="p-grid">
                <div className="p-col-12 p-md-4 p-lg-3">
                    <div className="card">
                        <div onContextMenu={handleContextMenu}>
                            <Tree
                                value={treeNodes}
                                selectionMode="single"
                                selectionKeys={selectedTreeNodeKeys}
                                onSelectionChange={(e) => {
                                    setSelectedTreeNodeKeys(e.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-md-8 p-lg-9">
                    <div className="card" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        {selectedNode ? (
                            <>
                                <h5 style={{ marginTop: 0, marginBottom: '1rem', flexShrink: 0 }}>
                                    {selectedNode.icon === 'pi pi-fw pi-file' || (!selectedNode.children && selectedNode.icon !== 'pi pi-fw pi-folder')
                                        ? 'Nội dung file: ' + selectedNode.label
                                        : 'Thông tin: ' + selectedNode.label}
                                </h5>
                                {(!selectedNode.children && (selectedNode.icon === 'pi pi-fw pi-file' || !selectedNode.icon || selectedNode.icon.includes('file'))) ? (
                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <InputTextarea
                                            value={currentFileContent}
                                            onChange={(e) => setCurrentFileContent(e.target.value)}
                                            rows={20}
                                            style={{
                                                width: '100%',
                                                height: 'calc(90vh - 10rem)',
                                                fontFamily: 'monospace',
                                                maxWidth: '100%',
                                                boxSizing: 'border-box',
                                                resize: 'vertical'
                                            }}
                                            placeholder="Nhập nội dung file..."
                                        />
                                        <div style={{ marginTop: '1rem' }}>
                                            <Button
                                                style={{ margin: '0 4px' }}
                                                label="Lưu"
                                                icon="pi pi-save"
                                                onClick={handleSaveFileContent}
                                            />
                                            <Button
                                                style={{ margin: '0 4px' }}
                                                label="Chạy"
                                                icon="pi pi-forward"
                                                onClick={confirmRun}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p><strong>Loại:</strong> Thư mục</p>
                                        <p><strong>Mô tả:</strong> {selectedNode.data || 'Không có mô tả'}</p>
                                        {selectedNode.children && (
                                            <p><strong>Số lượng mục con:</strong> {selectedNode.children.length}</p>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <p>Chọn một file hoặc thư mục để xem chi tiết</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Dockable Terminal */}
            {terminalVisible ? (
                <div
                    className="terminal-dock"
                    style={{
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1100,
                        display: 'flex',
                        justifyContent: 'center',
                        pointerEvents: 'auto'
                    }}
                >
                    <div
                        className="card"
                        style={{
                            width: '100%',
                            maxWidth: '100%',
                            boxShadow: 'none',
                            borderRadius: '0',
                            overflow: 'hidden',
                            height: terminalCollapsed ? '40px' : '320px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'revert', justifyContent: 'right', padding: '2px 4px', background: '#0b0b0b', borderBottom: '1px solid #222' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                <Button icon="pi pi-times" className="p-button-text p-button-sm" onClick={() => setTerminalVisible(false)} aria-label="Đóng" style={{ color: '#fff' }} />
                            </div>
                        </div>

                        <div style={{ flex: terminalCollapsed ? '0 0 0' : '1 1 auto', overflow: 'auto', display: terminalCollapsed ? 'none' : 'block', background: '#000', color: '#fff' }}>
                            <div style={{ height: '100%', background: '#000', color: '#fff', padding: '12px', boxSizing: 'border-box' }}>
                                <Terminal prompt={prompt} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1100 }}>
                    <Button icon="pi pi-terminal" className="p-button-rounded p-button-primary" onClick={() => { setTerminalVisible(true); setTerminalCollapsed(false); }} aria-label="Mở Terminal" />
                </div>
            )}

            {/* Add Dialog */}
            <Dialog
                visible={addDialog}
                style={{ width: '450px' }}
                header="Thêm mới"
                modal
                className="p-fluid"
                onHide={() => setAddDialog(false)}
                footer={
                    <div>
                        <Button label="Hủy" icon="pi pi-times" onClick={() => setAddDialog(false)} className="p-button-text" />
                        <Button label="Thêm" icon="pi pi-check" onClick={handleAddNode} />
                    </div>
                }
            >
                <div className="p-field">
                    <label htmlFor="nodeName">Tên</label>
                    <InputText
                        id="nodeName"
                        value={newNodeName}
                        onChange={(e) => setNewNodeName(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="p-field">
                    <label>Loại</label>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <div className="p-field-radiobutton">
                            <RadioButton
                                inputId="typeFolder"
                                name="nodeType"
                                value="folder"
                                checked={newNodeType === 'folder'}
                                onChange={(e) => setNewNodeType('folder')}
                            />
                            <label htmlFor="typeFolder" style={{ marginLeft: '0.5rem' }}>Thư mục</label>
                        </div>
                        <div className="p-field-radiobutton">
                            <RadioButton
                                inputId="typeFile"
                                name="nodeType"
                                value="file"
                                checked={newNodeType === 'file'}
                                onChange={(e) => setNewNodeType('file')}
                            />
                            <label htmlFor="typeFile" style={{ marginLeft: '0.5rem' }}>File</label>
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                visible={editDialog}
                style={{ width: '450px' }}
                header="Sửa tên"
                modal
                className="p-fluid"
                onHide={() => setEditDialog(false)}
                footer={
                    <div>
                        <Button label="Hủy" icon="pi pi-times" onClick={() => setEditDialog(false)} className="p-button-text" />
                        <Button label="Lưu" icon="pi pi-check" onClick={handleEditNode} />
                    </div>
                }
            >
                <div className="p-field">
                    <label htmlFor="editNodeName">Tên mới</label>
                    <InputText
                        id="editNodeName"
                        value={editNodeName}
                        onChange={(e) => setEditNodeName(e.target.value)}
                        autoFocus
                    />
                </div>
            </Dialog>

            {/* Result Dialog */}
            <Dialog
                visible={resultDialog}
                style={{ width: '90vw', maxWidth: '90vw' }}
                header="Kết quả thực thi"
                modal
                className="p-fluid"
                onHide={() => setResultDialog(false)}
                footer={
                    <div>
                        <Button label="Đóng" icon="pi pi-times" onClick={() => setResultDialog(false)} />
                    </div>
                }
            >
                <div>
                    <InputTextarea
                        value={resultContent}
                        rows={25}
                        style={{
                            width: '100%',
                            fontFamily: 'monospace',
                            maxWidth: '100%',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
            </Dialog>
        </>
    )
}
