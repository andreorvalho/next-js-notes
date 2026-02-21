import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import UserMenu from './UserMenu';

const meta: Meta<typeof UserMenu> = {
  title: 'Components/UserMenu',
  component: UserMenu,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onLogout: { action: 'logout' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onLogout: () => {},
  },
};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [loggedOut, setLoggedOut] = useState(false);

    const handleLogout = () => {
      setLoggedOut(true);
    };

    return (
      <div className="min-h-screen relative">
        {loggedOut && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium z-[1100]">
            Logout clicked
          </div>
        )}
        <p className="absolute top-8 left-8 text-text-secondary text-sm">
          Click the user icon in the bottom-right to open the menu, then click
          Logout.
        </p>
        <UserMenu onLogout={handleLogout} />
      </div>
    );
  },
};
