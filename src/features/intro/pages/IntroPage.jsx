import { useParams } from 'react-router-dom';
import PlaceholderPage from '../../../components/PlaceholderPage';

export default function IntroPage() {
  const { shareSlug, intentId } = useParams();
  return <PlaceholderPage title="Intro" description={`Placeholder intro for share ${shareSlug} and intent ${intentId}.`} />;
}
