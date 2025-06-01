import Model from './Model';
import SettingsButton from './SettingsButton';
import SidebarButton from './SidebarButton';

export default function Header() {
  return (
    <header className="z-10 flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <SidebarButton />
        <Model />
      </div>

      <SettingsButton />
    </header>
  );
}
