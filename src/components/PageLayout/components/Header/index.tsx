import { Antd, WalletConnector } from 'components';
import { Link, useNavigate } from 'react-router-dom';
import { routes, TRoute } from 'App.routes';
import LogoIcon from 'components/LogoIcon';
import cx from 'classnames';
import styles from './Header.module.scss';
import useCurrentPage from 'hooks/useCurrentPage';
import classNames from 'classnames';
import GithubIcon from 'resources/icons/GitHub-Mark-Light-120px-plus.png';
import { CloseIcon, MenuIcon } from 'resources/icons';
import { Drawer } from 'antd';
import { useCallback, useState } from 'react';
import Button from 'components/Button';
import { useSelector } from 'react-redux';
import { getIsResourcesNotFound } from 'modules/common/reducer';

const { Header } = Antd.Layout;

const SiteBadge = () => {
  return (
    <div className="bg-[#fe6e65] w-[300px] text-white text-center font-bold text-[22px] h-[44px] leading-[44px] rotate-45 translate-x-[140px] tablet:translate-x-[113px] mobile:scale-[0.6] mobile:pl-[72px]">
      <img src={GithubIcon} className="w-6 inline-block" /> Devnet beta
    </div>
  );
};

interface ISideMenuProps {
  currentPageName: TRoute['name'];
  onRouteSelected: () => void;
}

const SideMenu = ({ currentPageName, onRouteSelected }: ISideMenuProps) => {
  const navigate = useNavigate();
  const onRoute = useCallback(
    (path: string | undefined) => {
      navigate(path || '/');
      onRouteSelected();
    },
    [navigate, onRouteSelected]
  );
  return (
    <div className="h-full flex flex-col">
      <div className="w-full space-y-4">
        {routes
          .filter((r) => r.path !== '*' && !r.hidden)
          .map(({ name, path }) => {
            const isCurrent = currentPageName === name;
            return (
              <Button
                key={`${name}-${isCurrent}`}
                className={classNames('w-full', { '!bg-primePurple-100': isCurrent })}
                variant={'outlined'}
                onClick={() => onRoute(path)}>
                {name}
              </Button>
            );
          })}
      </div>
      <div className="mt-auto title">V {process.env.REACT_APP_VERSION}</div>
    </div>
  );
};

const PageHeader: React.FC = () => {
  const [currentPageName] = useCurrentPage();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const isResourcesNotFound = useSelector(getIsResourcesNotFound);

  const renderNavItems = useCallback(() => {
    return routes.map(({ name, path, hidden }) => {
      if (path === '*' || hidden) return null;
      return (
        <Antd.Menu.Item key={name}>
          <Link to={path || '/'} className="header5 bold">
            {name}
          </Link>
        </Antd.Menu.Item>
      );
    });
  }, []);

  return (
    <Header
      className={classNames(
        'z-20 w-full px-16 py-8 bg-transparent h-[140px] tablet:px-8 mobile:px-4 mobile:py-2 mobile:h-[56px]'
      )}>
      <div className="mx-auto h-full top-0 left-0 flex items-center relative">
        <MenuIcon
          className="hidden w-[24px] h-[24px] mr-4 mobile:inline-block"
          onClick={() => setIsSideMenuOpen(true)}
        />
        <div
          className={classNames(
            'h-full absolute left-0 top-0 mobile:left-1/2 mobile:-translate-x-1/2'
          )}>
          <Link
            to="/"
            className={classNames('h-full flex items-center justify-center', {
              'mobile:hidden': currentPageName !== 'Home'
            })}>
            <LogoIcon className="w-auto h-[48px] mobile:h-full" />
          </Link>
          <div
            className={classNames('hidden h6 h-full', {
              'mobile:flex mobile:items-center': currentPageName !== 'Home'
            })}>
            {currentPageName}
          </div>
        </div>
        <div className="grow items-center justify-center h-full">
          <Antd.Menu
            mode="horizontal"
            theme="dark"
            className={cx(
              styles.menu,
              'flex justify-center h-full min-w-[200px] w-full !bg-transparent mobile:hidden'
            )}
            selectedKeys={[currentPageName]}>
            {!isResourcesNotFound && renderNavItems()}
          </Antd.Menu>
        </div>
        <div className="absolute right-0 top-0 h-full w-fit flex items-center">
          {currentPageName !== 'Home' && <WalletConnector />}
          {currentPageName === 'Home' && <SiteBadge />}
        </div>
      </div>
      <Drawer
        visible={isSideMenuOpen}
        placement="left"
        closeIcon={<CloseIcon />}
        width="70%"
        onClose={() => setIsSideMenuOpen(false)}>
        {!isResourcesNotFound && (
          <SideMenu
            currentPageName={currentPageName}
            onRouteSelected={() => setIsSideMenuOpen(false)}
          />
        )}
      </Drawer>
    </Header>
  );
};

export default PageHeader;
