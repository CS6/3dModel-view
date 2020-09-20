import React, { useState, useCallback } from 'react';
import { Layout, Menu } from 'antd';
import {
  FileOutlined,
  FolderOutlined,
  FolderAddOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import { MenuProps } from 'antd/lib/menu';

const { Sider } = Layout;
const { SubMenu } = Menu;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [
    directoryHandle,
    setDirectoryHandle,
  ] = useState<FileSystemDirectoryHandle | null>(null);
  const [fileHandles, setFileHandles] = useState<FileSystemFileHandle[] | null>(
    null
  );

  const openFolder = useCallback(async () => {
    if (!('showDirectoryPicker' in global)) {
      return;
    }

    // @ts-ignore
    const directoryHandle: FileSystemDirectoryHandle = await showDirectoryPicker();

    const fileHandles: FileSystemFileHandle[] = [];

    for await (const fileHandle of directoryHandle.getEntries()) {
      fileHandles.push(fileHandle);
    }

    setDirectoryHandle(directoryHandle);
    setFileHandles(fileHandles);
  }, [setFileHandles]);

  const openFileOrFolder = useCallback<MenuProps['onClick']>(
    ({ key }) => {
      if (key === 'open-folder') {
        openFolder();
      }
    },
    [openFolder]
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Menu
          theme="dark"
          defaultSelectedKeys={['-1']}
          mode="inline"
          onClick={openFileOrFolder}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Menu.Item key="open-folder" icon={<FolderAddOutlined />}>
            開啟資料夾
          </Menu.Item>

          {directoryHandle && (
            <SubMenu
              key="folder"
              title={directoryHandle.name}
              icon={fileHandles ? <FolderOutlined /> : <FolderAddOutlined />}
            >
              {fileHandles?.map((fileHandle, index) => (
                <Menu.Item key={`file-${index}`} icon={<FileOutlined />}>
                  {fileHandle.name}
                </Menu.Item>
              ))}
            </SubMenu>
          )}
        </Menu>
      </Sider>
    </Layout>
  );
}

export default App;
