import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';

import LockedFeatureGuard from '@/app/components/locked-feature-guard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/spinner';
import { INTERNAL_ERROR_TOAST, toast } from '@/components/ui/use-toast';
import { ConnectGitDialog } from '@/features/git-sync/components/connect-git-dialog';
import { gitSyncApi } from '@/features/git-sync/lib/git-sync-api';
import { gitSyncHooks } from '@/features/git-sync/lib/git-sync-hooks';
import { platformHooks } from '@/hooks/platform-hooks';
import { authenticationSession } from '@/lib/authentication-session';
import { assertNotNullOrUndefined } from '@activepieces/shared';

import { ReleaseCard } from './release-card';

const EnvironmentPage = () => {
  const { platform } = platformHooks.useCurrentPlatform();

  const { gitSync, isLoading, refetch } = gitSyncHooks.useGitSync(
    authenticationSession.getProjectId()!,
    platform.environmentEnabled,
  );

  const { mutate } = useMutation({
    mutationFn: () => {
      assertNotNullOrUndefined(gitSync, 'gitSync');
      return gitSyncApi.disconnect(gitSync.id);
    },
    onSuccess: () => {
      refetch();
      toast({
        title: t('Git Sync Disconnected'),
        description: t('You have successfully disconnected your Git Sync'),
        duration: 3000,
      });
    },
    onError: () => {
      toast(INTERNAL_ERROR_TOAST);
    },
  });

  return (
    <LockedFeatureGuard
      featureKey="ENVIRONMENT"
      locked={!platform.environmentEnabled}
      lockTitle={t('Unlock Environment')}
      lockDescription={t(
        "Streamline your team's workflow for a seamless experience to build and deploy flows across your environments",
      )}
    >
      <div className="flex w-full flex-col items-start justify-center gap-4">
        <div className="flex flex-col justify-start items-start w-full">
          <h1 className="text-2xl font-bold flex-grow">{t('Environment')}</h1>
          <span className="text-muted-foreground text-md">
            {t(
              'This feature allows for the creation of an external backup, environments, and maintaining a version history',
            )}
          </span>
        </div>
        <Card className="w-full p-4">
          <div className="flex w-full">
            {!isLoading && (
              <>
                <div className="flex flex-grow flex-col gap-2">
                  <p>
                    {t('Remote URL')}:{' '}
                    {gitSync?.remoteUrl ?? t('Not Connected')}
                  </p>
                  <p>
                    {t('Branch')}: {gitSync?.branch ?? t('Not Connected')}
                  </p>
                  <p>
                    {t('Folder')}: {gitSync?.slug ?? t('Not Connected')}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  {!gitSync && (
                    <ConnectGitDialog showButton={true}></ConnectGitDialog>
                  )}
                  {gitSync && (
                    <div className="flex flex-col gap-2">
                      <Button
                        size={'sm'}
                        onClick={() => mutate()}
                        className="w-32 text-destructive"
                        variant={'basic'}
                      >
                        {t('Disconnect')}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
            {isLoading && (
              <div className="flex flex-grow justify-center items-center">
                <LoadingSpinner className="w-5 h-5"></LoadingSpinner>
              </div>
            )}
          </div>
        </Card>
        <ReleaseCard />
      </div>
    </LockedFeatureGuard>
  );
};

export { EnvironmentPage };