import NewChatButton from '../NewChatButton';
import SidebarButton from '../SidebarButton';
import Model from './Model';
import SettingsButton from './SettingsButton';

export default function Header() {
  return (
    <header className="z-10 flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <SidebarButton />
        <NewChatButton />
        <Model />
      </div>

      <SettingsButton />
    </header>
  );
}
