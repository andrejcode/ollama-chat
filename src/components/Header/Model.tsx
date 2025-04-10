import useModelContext from '@/hooks/useModelContext';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function Model() {
  const { isLoading, currentModel } = useModelContext();

  return isLoading ? (
    <LoadingSpinner isLoading={isLoading} />
  ) : (
    <div className="text-xl">{currentModel}</div>
  );
}
