import { useParams } from 'react-router-dom';
import PlaceholderPage from '../../../components/PlaceholderPage';

export default function ViewerProfilePage() {
  const { shareSlug } = useParams();
  return <PlaceholderPage title="Viewer Profile" description={`Placeholder for viewer profile route: ${shareSlug}`} />;
}
