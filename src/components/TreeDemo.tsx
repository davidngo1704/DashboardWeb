import { useState, useEffect, useRef, useCallback } from 'react';
import { Tree } from 'primereact/tree';
import { ContextMenu } from 'primereact/contextmenu';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import NodeService from '../service/NodeService';

interface TreeNode {
    key: string;
    label: string;
    data?: string;
    icon?: string;
    children?: TreeNode[];
}

export const TreeDemo = () => {

    const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
    const [selectedTreeNodeKeys, setSelectedTreeNodeKeys] = useState<{ [key: string]: boolean }>({});
    const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
    const [fileContents, setFileContents] = useState<{ [key: string]: string }>({});
    const [currentFileContent, setCurrentFileContent] = useState('');
    const [addDialog, setAddDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [newNodeName, setNewNodeName] = useState('');
    const [newNodeType, setNewNodeType] = useState<'folder' | 'file'>('folder');
    const [editNodeName, setEditNodeName] = useState('');
    const contextMenu = useRef<any>(null);
    const toast = useRef<any>(null);

    useEffect(() => {
        const nodeService = new NodeService();
        nodeService.getTreeNodes().then(data => {
            console.log(data);
            setTreeNodes(data)
        });
    }, []);

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
        const selectedKey = Object.keys(selectedTreeNodeKeys)[0];
        if (selectedKey) {
            const node = findNodeByKey(treeNodes, selectedKey);
            if (node) {
                setSelectedNode(node);
                // Check if it's a file (has pi-file icon or no children)
                const isFile = !node.children && (node.icon === 'pi pi-fw pi-file' || !node.icon || node.icon.includes('file'));
                if (isFile) {
                    const content = fileContents[selectedKey] || '';
                    setCurrentFileContent(content);
                } else {
                    setCurrentFileContent('');
                }
            }
        } else {
            setSelectedNode(null);
            setCurrentFileContent('');
        }
    }, [selectedTreeNodeKeys, treeNodes, fileContents]);

    // Handle add node
    const handleAddNode = () => {
        if (!newNodeName.trim()) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập tên', life: 3000 });
            return;
        }

        const selectedKey = Object.keys(selectedTreeNodeKeys)[0];
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

        setTreeNodes(prevNodes => {
            return updateTreeNodes(prevNodes, selectedKey, (node) => {
                return {
                    ...node,
                    children: [...(node.children || []), newNode]
                };
            });
        });

        // Initialize empty content for new files
        if (newNodeType === 'file') {
            setFileContents(prev => ({
                ...prev,
                [newKey]: ''
            }));
        }

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

        const selectedKey = Object.keys(selectedTreeNodeKeys)[0];
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

        setEditNodeName('');
        setEditDialog(false);
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật tên', life: 3000 });
    };

    // Handle delete node
    const handleDeleteNode = () => {
        const selectedKey = Object.keys(selectedTreeNodeKeys)[0];
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
            setFileContents(prev => {
                const newContents = { ...prev };
                delete newContents[selectedKey];
                return newContents;
            });
        } else {
            // Remove all file contents for children recursively
            const removeChildrenContents = (node: TreeNode) => {
                if (!node.children) {
                    setFileContents(prev => {
                        const newContents = { ...prev };
                        delete newContents[node.key];
                        return newContents;
                    });
                } else {
                    node.children.forEach((child: TreeNode) => removeChildrenContents(child));
                }
            };
            removeChildrenContents(node);
        }

        setSelectedTreeNodeKeys({});
        setSelectedNode(null);
        setCurrentFileContent('');
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa node', life: 3000 });
    };

    // Handle context menu
    const handleContextMenu = (e: any) => {
        contextMenu.current?.show(e);
    };

    // Open add dialog
    const openAddDialog = () => {
        const selectedKey = Object.keys(selectedTreeNodeKeys)[0];
        if (!selectedKey) {
            toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn một thư mục để thêm vào', life: 3000 });
            return;
        }
        setNewNodeName('');
        setNewNodeType('folder');
        setAddDialog(true);
    };

    // Open edit dialog
    const openEditDialog = () => {
        const selectedKey = Object.keys(selectedTreeNodeKeys)[0];
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
        const selectedKey = Object.keys(selectedTreeNodeKeys)[0];
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
        const selectedKey = Object.keys(selectedTreeNodeKeys)[0];
        if (selectedKey) {
            setFileContents(prev => ({
                ...prev,
                [selectedKey]: currentFileContent
            }));
            toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đã lưu nội dung file', life: 3000 });
        }
    };

    // Context menu items
    const contextMenuItems = [
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

    // Update selected node when selection changes
    useEffect(() => {
        handleNodeClick();
    }, [handleNodeClick]);

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <ContextMenu model={contextMenuItems} ref={contextMenu} />
            
            <div className="p-grid">
                <div className="p-col-3">
                    <div className="card">
                        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <Button 
                                label="Thêm thư mục" 
                                icon="pi pi-folder-plus" 
                                className="p-button-sm" 
                                onClick={() => {
                                    setNewNodeType('folder');
                                    openAddDialog();
                                }}
                            />
                            <Button 
                                label="Thêm file" 
                                icon="pi pi-file-plus" 
                                className="p-button-sm p-button-secondary" 
                                onClick={() => {
                                    setNewNodeType('file');
                                    openAddDialog();
                                }}
                            />
                            <Button 
                                label="Sửa" 
                                icon="pi pi-pencil" 
                                className="p-button-sm p-button-info" 
                                onClick={openEditDialog}
                                disabled={!selectedNode}
                            />
                            <Button 
                                label="Xóa" 
                                icon="pi pi-trash" 
                                className="p-button-sm p-button-danger" 
                                onClick={confirmDelete}
                                disabled={!selectedNode}
                            />
                        </div>
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
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleAddNode();
                            }
                        }}
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
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleEditNode();
                            }
                        }}
                    />
                </div>
            </Dialog>
        </>
    )
}
