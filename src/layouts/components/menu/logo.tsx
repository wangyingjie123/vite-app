import logo from '@/assets/images/react.svg';

interface LogoProps {
  isCollapse: boolean;
}
const Logo = (props: LogoProps) => {
  const { isCollapse } = props;
  return (
    <div className="logo-box">
      <img src={logo} alt="logo" className="logo-img" />
      {!isCollapse ? <h2 className="logo-text">User Admin</h2> : null}
    </div>
  );
};

export default Logo;
