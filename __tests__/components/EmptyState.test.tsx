import { render, screen } from '@testing-library/react';
import EmptyState from '@/components/layout/EmptyState';
import { FolderKanban } from 'lucide-react';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState icon={FolderKanban} title="No projects yet" description="Get started." />);
    expect(screen.getByText('No projects yet')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<EmptyState icon={FolderKanban} title="Empty" description="Nothing here to show." />);
    expect(screen.getByText('Nothing here to show.')).toBeInTheDocument();
  });

  it('renders the action slot when provided', () => {
    render(
      <EmptyState
        icon={FolderKanban}
        title="No projects"
        description="Create one."
        action={<button>Create Project</button>}
      />
    );
    expect(screen.getByRole('button', { name: 'Create Project' })).toBeInTheDocument();
  });

  it('does not render a button when action is not provided', () => {
    render(<EmptyState icon={FolderKanban} title="Empty" description="Nothing here." />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
