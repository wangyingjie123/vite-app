import { Card, Typography } from 'antd';
import { FC } from 'react';

interface PageCardProps {
  extra?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}
const { Title } = Typography;
const PageCard: FC<PageCardProps> = (props) => {
  return (
    <Card
      type="inner"
      className="box-inner"
      bordered={false}
      title={<Title level={5}>{props.title}</Title>}
      extra={props.extra}
    >
      {props.children}
    </Card>
  );
};

export default PageCard;
