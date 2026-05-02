import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '@/components/board/TaskCard';
import { Task } from '@/types';

jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => '' } },
}));

const mockTask: Task = {
  id: 'task-1',
  title: 'Fix login bug',
  description: 'Button is not clickable on mobile',
  status: 'todo',
  assigneeId: null,
  creatorId: 'user-1',
  projectId: 'proj-1',
  createdAt: Date.now() - 3_600_000,
  updatedAt: Date.now() - 3_600_000,
};

describe('TaskCard', () => {
  it('renders the task title', () => {
    render(<TaskCard task={mockTask} onClick={jest.fn()} />);
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  it('renders the task description', () => {
    render(<TaskCard task={mockTask} onClick={jest.fn()} />);
    expect(screen.getByText(/Button is not clickable/)).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', async () => {
    const onClick = jest.fn();
    render(<TaskCard task={mockTask} onClick={onClick} />);
    await userEvent.click(screen.getByText('Fix login bug'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not show initials badge when task has no assignee', () => {
    render(<TaskCard task={mockTask} onClick={jest.fn()} />);
    // Initials badge only renders when assigneeId is set with a display name
    expect(screen.queryByText(/^[A-Z]{2}$/)).not.toBeInTheDocument();
  });
});
