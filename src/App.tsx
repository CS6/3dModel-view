import React, { useState, useCallback } from 'react';
import { Layout, Menu, Tag, Input, Space, Divider } from 'antd';
import {
  FileOutlined,
  FolderOutlined,
  FolderAddOutlined,
  TagOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import { MenuProps } from 'antd/lib/menu';

const { Sider, Content, Header } = Layout;
const { SubMenu } = Menu;
const { CheckableTag } = Tag;

function App() {
  const [fileSiderCollapsed, setFileSiderCollapsed] = useState(false);
  const [tagsSiderCollapsed, setTagsSiderCollapsed] = useState(false);

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
      <Sider
        collapsible
        collapsed={fileSiderCollapsed}
        onCollapse={setFileSiderCollapsed}
      >
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
      <Layout>
        <Header style={{ background: '#fff' }}></Header>
        <Content></Content>
      </Layout>
      <Sider
        theme="light"
        collapsible
        collapsed={tagsSiderCollapsed}
        onCollapse={setTagsSiderCollapsed}
        reverseArrow
      >
        <div style={{ padding: 10 }}>
          <Input.Search enterButton placeholder="search tags" />
        </div>
        <Divider style={{ margin: 0 }} />
        <div style={{ padding: 10 }}>
          找不到自己加:
          <Input.Search
            placeholder="add group"
            enterButton={<PlusOutlined />}
          />
        </div>
        <Menu theme="light" mode="inline">
          <SubMenu key="tag-group-1" title="tag group 1" icon={<TagOutlined />}>
            <Menu.Item style={{ height: 'auto' }}>
              <Space style={{ flexWrap: 'wrap' }}>
                <CheckableTag checked>tag 1</CheckableTag>
                <CheckableTag checked={false}>tag 2</CheckableTag>
                <Tag className="site-tag-plus">
                  <PlusOutlined />
                  New
                </Tag>
              </Space>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    </Layout>
  );
}

export default App;
