import { Typography } from 'antd';
import { memo, type FC } from 'react';
// import { useSearchParams } from 'react-router-dom';

interface BreadCrumbProps {
  pathList: string[];
  updateSearch: {
    (type: 'add' | 'replace', path: string): void;
    (type: 'back' | 'reset'): void;
  };
}
const { Text } = Typography;
const BreadCrumb: FC<BreadCrumbProps> = ({ pathList, updateSearch }) => {
  const pathClick = (path: string) => {
    if (path === '/') {
      updateSearch('reset');
      return;
    }
    updateSearch('replace', path);
  };
  const backPrevious = () => {
    updateSearch('back');
  };
  return (
    <div className="mb-10px flex">
      <div className="ant-breadcrumb">
        {pathList.length > 1 && (
          <>
            <span className="color-[#1677ff] cursor-pointer" onClick={backPrevious}>
              返回上一级
            </span>
            <Text type="secondary" className="mx-5px">
              |
            </Text>
          </>
        )}
      </div>
      {pathList.map((item, index) => (
        <div key={index}>
          {index === pathList.length - 1 ? (
            <Text type="secondary" className="mx-5px">
              {item === '/' ? '全部文件' : item}
            </Text>
          ) : (
            <>
              <span className="color-[#1677ff] cursor-pointer" onClick={() => pathClick(item)}>
                {item === '/' ? '全部文件' : item}
              </span>
              <Text type="secondary" className="mx-5px">
                &gt;
              </Text>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
export default memo(BreadCrumb);
