import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationBell from '@/components/notifications/NotificationBell';

const mockContext = {
  notifications: [],
  unreadCount: 0,
  markAsRead: jest.fn(),
  markAllRead: jest.fn(),
};

jest.mock('@/contexts/NotificationContext', () => ({
  useNotifications: () => mockContext,
}));

jest.mock('next/link', () => {
  const Link = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  Link.displayName = 'Link';
  return Link;
});

beforeEach(() => {
  mockContext.unreadCount = 0;
  mockContext.notifications = [];
});

describe('NotificationBell', () => {
  it('renders the bell button', () => {
    render(<NotificationBell />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not show a badge when unreadCount is 0', () => {
    render(<NotificationBell />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('shows the unread count badge when there are unread notifications', () => {
    mockContext.unreadCount = 5;
    render(<NotificationBell />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows "9+" when unread count exceeds 9', () => {
    mockContext.unreadCount = 12;
    render(<NotificationBell />);
    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('opens the dropdown when the bell button is clicked', async () => {
    render(<NotificationBell />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });
});
