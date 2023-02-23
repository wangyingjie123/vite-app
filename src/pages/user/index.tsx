import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import PageCard from '@/components/page-card';

function User() {
  const navigate = useNavigate();
  return (
    <PageCard title="用户管理">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, 这是首页"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Back Home
          </Button>
        }
      />
    </PageCard>
  );
}
export default User;
