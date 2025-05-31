import Model from './Model';
import SettingsButton from './SettingsButton';
import SidebarButton from './SidebarButton';

export default function Header() {
  return (
    <header className="z-10 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarButton />
        <Model />
      </div>

      <SettingsButton />
    </header>
  );
}
