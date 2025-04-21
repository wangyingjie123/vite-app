import {
  ShareAltOutlined,
  DeleteOutlined,
  DragOutlined,
  CopyOutlined,
  EditOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { Icon } from '@iconify/react';
import { message, modal } from '@south/message';
import { Button, Flex, Tooltip, Table, Dropdown, type TableProps, type MenuProps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import BreadCrumb from './components/bread-crumb';
import { EditableCell, EditableRow } from './components/editable-cell';
import Upload from './components/upload-file';
import { searchList } from './model';

import type { FileData } from '#/file';
import type { PagePermission } from '#/public';
import BaseCard from '@/components/Card/BaseCard';
import BaseContent from '@/components/Content/BaseContent';
import BasePagination from '@/components/Pagination/BasePagination';
import BaseSearch from '@/components/Search/BaseSearch';
import { useCommonStore } from '@/hooks/useCommonStore';
import { useTimes } from '@/hooks/useTime';
import { getArticlePage, deleteArticle } from '@/servers/content/article';
import { INIT_PAGINATION } from '@/utils/config';
import { checkPermission } from '@/utils/permissions';

type ColumnTypes = Exclude<TableProps<FileData>['columns'], undefined>;

function Page() {
  const { t } = useTranslation();
  const { permissions } = useCommonStore();
  const { time } = useTimes();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasTemporaryRef = useRef(false);
  const isSearchInit = useRef(false);
  const [pathList, setPathList] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<Pick<FileData, 'filename'>>({ filename: '' });
  const [page, setPage] = useState(INIT_PAGINATION.page);
  const [pageSize, setPageSize] = useState(INIT_PAGINATION.pageSize);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState<FileData[]>([]);
  const [editingKey, setEditingKey] = useState('');

  // 权限前缀
  const permissionPrefix = '/file-list';
  // 权限
  const pagePermission: PagePermission = {
    page: checkPermission(`${permissionPrefix}/index`, permissions),
    create: checkPermission(`${permissionPrefix}/create`, permissions),
    update: checkPermission(`${permissionPrefix}/update`, permissions),
    delete: checkPermission(`${permissionPrefix}/delete`, permissions),
  };

  // 获取表格数据
  const getPage = async (currentPath?: string) => {
    const params = { page, pageSize, path: currentPath };
    setLoading(true);
    try {
      const { data, code } = await getArticlePage(params);
      if (code === 200) {
        const { items, total } = data;
        setTotal(total);
        setDataSource(items);
      }
    } finally {
      setLoading(false);
    }
  };
  /**
   * 点击搜索
   * @param values - 表单返回数据
   */
  const onSearch = (values: Pick<FileData, 'filename'>) => {
    setPage(1);
    setSearchData(values);
  };

  useEffect(() => {
    if (!pagePermission.page) {
      return;
    }
    const search = searchParams.get('path');
    let path = '';
    if (search) {
      path = decodeURI(search);
      const otherPath = path.replace(/^\/+/, '');
      const pathArray = ['/', ...otherPath.split('/').filter((item) => item)];
      setPathList(pathArray);
    } else {
      setPathList(['/']);
    }
    if (isSearchInit.current) {
      return;
    }
    getPage(path);
    isSearchInit.current = true;
  }, [searchParams.get('path'), pagePermission.page]);
  /**
   * 点击删除
   * @param id - 唯一值
   */
  const onDelete = async (id: string) => {
    try {
      const confirmed = await modal.confirm({
        title: '确定要删除所选文件吗？',
        content: '删除后不可恢复',
      });
      if (!confirmed) {
        return;
      }
      const { code, message: info } = await deleteArticle(id);
      if (code === 200) {
        message.success(info || t('public.successfullyDeleted'));
        getPage();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createFolder = () => {
    if (hasTemporaryRef.current) {
      return;
    }
    hasTemporaryRef.current = true;
    const id = `${new Date().getTime()}`;
    setDataSource([
      {
        id,
        type: 'folder',
        filename: '',
        updateAt: time,
        size: '',
      },
      ...dataSource,
    ]);
    setEditingKey(id);
  };

  const deleteTemporaryFolder = () => {
    if (!hasTemporaryRef.current) {
      return;
    }
    setDataSource((prev) => prev.filter((item) => item.id !== editingKey));
    setEditingKey('');
    hasTemporaryRef.current = false;
  };
  /**
   * 处理分页
   * @param page - 当前页数
   * @param pageSize - 每页条数
   */
  const onChangePagination = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // 更多菜单
  const menuItems: MenuProps['items'] = [
    ...(pagePermission.update
      ? [
          {
            label: '重命名',
            key: '1',
            icon: <EditOutlined />,
          },
        ]
      : []),
    {
      label: '复制',
      key: '2',
      icon: <CopyOutlined />,
    },
    {
      label: '移动',
      key: '3',
      icon: <DragOutlined />,
    },
  ];

  /**
   * 表格数据
   * @param optionRender - 渲染操作函数
   */
  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: t('file.fileName'),
      dataIndex: 'filename',
      width: '47%',
      editable: true,
      ellipsis: true,
    },
    {
      title: t('file.updateTime'),
      dataIndex: 'updateAt',
    },
    {
      title: t('file.fileSize'),
      dataIndex: 'size',
      render: (size) => (size ? size : '-'),
    },
    {
      title: t('public.operate'),
      dataIndex: 'operate',
      width: 160,
      render: (_value, record: FileData) => {
        if (editingKey === record.id && hasTemporaryRef.current) {
          return '-';
        }
        return (
          <Flex>
            <Tooltip title="分享">
              <Button type="text" icon={<ShareAltOutlined />} />
            </Tooltip>
            <Tooltip title="下载">
              <Button type="text" icon={<DownloadOutlined />} />
            </Tooltip>
            {pagePermission.delete && (
              <Tooltip title="删除">
                <Button type="text" icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} />
              </Tooltip>
            )}
            <Dropdown
              menu={{
                items: menuItems,
                onClick: (e) => {
                  if (e.key === '1') {
                    deleteTemporaryFolder();
                    setEditingKey(record.id);
                  }
                },
              }}
            >
              <Button type="text" icon={<Icon icon="nrk-ellipsis" />} />
            </Dropdown>
          </Flex>
        );
      },
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const isEditing = (record: FileData) => record.id === editingKey;
  /**
   * 保存编辑
   * @param record - 当前行数据
   * @param isSave - 是否保存
   */
  const handleSave = async (record: FileData, isSave: boolean) => {
    if (isSave) {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => record.id === item.id);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...record,
      });
      setDataSource(newData);
      // getPage();
      hasTemporaryRef.current = false;
    } else {
      deleteTemporaryFolder();
    }
    setEditingKey('');
  };
  function updateSearch(type: 'add' | 'replace', path: string): void;
  function updateSearch(type: 'back' | 'reset'): void;
  function updateSearch(type: 'add' | 'replace' | 'back' | 'reset', path?: string) {
    let nextPath = '';
    switch (type) {
      case 'add': {
        pathList.shift();
        pathList.push(path as string);
        const currentPath = pathList;
        nextPath = `/${currentPath.join('/')}`;
        break;
      }
      case 'replace': {
        const index = pathList.findIndex((item) => item === path);
        if (index >= 0) {
          pathList.splice(index + 1);
        }
        nextPath = `${pathList.join('/').replace(/^\/+/, '/')}`;
        break;
      }
      case 'back': {
        nextPath = pathList.slice(0, pathList.length - 1).join('/');
        break;
      }
      case 'reset': {
        nextPath = '/';
        break;
      }
      default: {
        break;
      }
    }
    setSearchParams({ path: decodeURI(nextPath) });
  }
  const pathSearch = (path: string) => {
    updateSearch('add', path);
  };
  // 表格列
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: FileData) => ({
        record,
        editable: col.editable,
        editing: isEditing(record),
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        pathSearch,
      }),
    };
  });
  return (
    <BaseContent isPermission={pagePermission.page}>
      <BaseCard>
        <Flex>
          <Upload createFolder={createFolder} />
          <BaseSearch list={searchList(t)} data={searchData} isLoading={isLoading} handleFinish={onSearch} />
        </Flex>
      </BaseCard>
      <BaseCard className="mt-10px">
        <BreadCrumb pathList={pathList} updateSearch={updateSearch} />
        <Table<FileData>
          rowKey="id"
          size="small"
          components={components}
          rowClassName="editable-row"
          rowSelection={{}}
          loading={isLoading}
          columns={columns as ColumnTypes}
          dataSource={dataSource}
          pagination={false}
        />
        <BasePagination
          disabled={isLoading}
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={onChangePagination}
        />
      </BaseCard>
    </BaseContent>
  );
}

export default Page;
