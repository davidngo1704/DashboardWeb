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
//import { deleteDataFromFirebase, uploadFile, deleteFile, readFileAsString } from '../firebase';
import httpClient from "../utils/htttpClient";

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
    

    useEffect(() => {
        (async () => {

            let items = await httpClient.getMethod("fast-api/document");

            setItemDocuments(items);
          
            setTreeNodes(buildTreeFromItems(items as PersistedNode[]));
        })();

    }, []);

    const buildTreeFromItems = (items: PersistedNode[]): TreeNode[] => {
        const rootNode: TreeNode = {
            key: "0",
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

            if (!item.parentKey || item.parentKey === '0') {
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

    // Helper: lấy full path (ví dụ: documents/ApiGateway/cleanup.sh) từ key đang chọn
    const getSelectedFullPath = (targetKey?: string): string | null => {
        const selectedKey = targetKey ?? getSelectedKey();
        if (!selectedKey) {
            return null;
        }

        if (selectedKey === '0') {
            return STORE_NAME;
        }

        const segments: string[] = [];
        let currentItem: any | undefined = itemDocuments.find(m => m.key === selectedKey);

        while (currentItem) {
            segments.push(currentItem.label);

            // Dừng khi đã tới root (parentKey rỗng hoặc '0')
            if (!currentItem.parentKey || currentItem.parentKey === '0') {
                break;
            }

            currentItem = itemDocuments.find(m => m.key === currentItem.parentKey);
        }

        if (segments.length === 0) {
            const labelPath = findLabelPathByKey(treeNodes, selectedKey);
            if (labelPath && labelPath.length > 1) {
                return [STORE_NAME, ...labelPath.slice(1)].join('/');
            }
            return STORE_NAME;
        }

        // Thêm tên store "documents" ở đầu cho đúng format ví dụ
        segments.push(STORE_NAME);

        return segments.reverse().join('/');
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
            //const content = await readFileAsString(fullPath);
            //setCurrentFileContent(content);
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

        httpClient.postMethod("fast-api/document", newNodeData);

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

        httpClient.putMethod(`fast-api/document/${item.id}`, item);

        setEditNodeName('');
        setEditDialog(false);
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật tên', life: 3000 });
    };

    // Handle delete node
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

        httpClient.deleteMethod(`fast-api/document/${item.id}`);

        if (item.type === "file") {
            let fullPath = getSelectedFullPath();

            //deleteFile(fullPath);
        }

        setSelectedTreeNodeKeys(null);
        setSelectedNode(null);
        setCurrentFileContent('');
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

    // Confirm delete
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

    // Save file content
    const handleSaveFileContent = () => {
        const selectedKey = getSelectedKey();
        if (selectedKey) {

            let fullPath = getSelectedFullPath();

            //uploadFile(currentFileContent, fullPath);

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

        const folderPath = getSelectedFullPath(parentKey) || STORE_NAME;
        const filePath = `${folderPath}/${file.name}`;
        const newKey = `${parentKey}-${Date.now()}`;

        try {
            //await uploadFile(file, filePath);

            const newNode: TreeNode = {
                key: newKey,
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

            const newNodeData = {
                key: newKey,
                label: file.name,
                type: 'file',
                parentKey
            };

            httpClient.postMethod("fast-api/document", newNodeData);

            setItemDocuments(prev => [...prev, newNodeData]);

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
                icon: 'pi pi-folder-plus',
                command: () => {
                    setNewNodeType('folder');
                    openAddDialog();
                }
            },
            {
                label: 'Thêm file',
                icon: 'pi pi-file-plus',
                command: () => {
                    setNewNodeType('file');
                    openAddDialog();
                }
            },
            {
                label: 'Upload file',
                icon: 'pi pi-file-plus',
                command: () => {
                    handleUploadFileMenuClick();
                }
            }
        ];

        const actionItems: MenuItem[] = [
            {
                label: 'Sửa',
                icon: 'pi pi-pencil',
                command: openEditDialog
            },
            {
                label: 'Xóa',
                icon: 'pi pi-trash',
                command: confirmDelete
            }
        ];

        return contextMenuType === 'file' ? actionItems : [...additionItems, ...actionItems];
    }, [contextMenuType, openAddDialog, openEditDialog, confirmDelete, handleUploadFileMenuClick]);

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
                <div className="p-col-3">
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
                <div className="p-col-9">
                    <div className="card">
                        {selectedNode ? (
                            <>
                                <h5>
                                    {selectedNode.icon === 'pi pi-fw pi-file' || (!selectedNode.children && selectedNode.icon !== 'pi pi-fw pi-folder')
                                        ? 'Nội dung file: ' + selectedNode.label
                                        : 'Thông tin: ' + selectedNode.label}
                                </h5>
                                {(!selectedNode.children && (selectedNode.icon === 'pi pi-fw pi-file' || !selectedNode.icon || selectedNode.icon.includes('file'))) ? (
                                    <div>
                                        <InputTextarea
                                            value={currentFileContent}
                                            onChange={(e) => setCurrentFileContent(e.target.value)}
                                            rows={20}
                                            style={{ width: '100%', fontFamily: 'monospace' }}
                                            placeholder="Nhập nội dung file..."
                                        />
                                        <div style={{ marginTop: '1rem' }}>
                                            <Button
                                                label="Lưu"
                                                icon="pi pi-save"
                                                onClick={handleSaveFileContent}
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
        </>
    )
}
