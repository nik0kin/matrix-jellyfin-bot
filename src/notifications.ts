import { ApiClient, jellyfin } from './jellyfin-types';

import serverNotifications from './serverNotifications';

interface Notification {
  title: string;
  body?: string;
  tag?: string;
  package?: any;
}

function showNewItemNotification(item: any) {
  let body = item.Name;

  if (item.SeriesName) {
    body = item.SeriesName + ' - ' + body;
  }

  const notification = {
    title: 'New ' + item.Type,
    body: body,
  };

  // const imageTags = item.ImageTags || {};

  // if (imageTags.Primary) {
  //   notification.icon = apiClient.getScaledImageUrl(item.Id, {
  //     width: 80,
  //     tag: imageTags.Primary,
  //     type: 'Primary',
  //   });
  // }

  showNotification(notification);
}

function onLibraryChanged(data: any, apiClient: ApiClient) {
  const newItems = data.ItemsAdded;

  if (!newItems.length) {
    return;
  }

  // Don't put a massive number of Id's onto the query string
  if (newItems.length > 12) {
    newItems.length = 12;
  }

  apiClient
    // TODO dont use getCurrentUserId()?
    .getItems(apiClient.getCurrentUserId(), {
      Recursive: true,
      Limit: 3,
      Filters: 'IsNotFolder',
      SortBy: 'DateCreated',
      SortOrder: 'Descending',
      Ids: newItems.join(','),
      MediaTypes: 'Audio,Video',
      EnableTotalRecordCount: false,
    })
    .then(function (result) {
      const items = result.Items;

      for (const item of items) {
        showNewItemNotification(item);
      }
    });
}

function showPackageInstallNotification(
  apiClient: ApiClient,
  installation: any,
  status: string
) {
  apiClient.getCurrentUser().then(function (user: any) {
    if (!user.Policy.IsAdministrator) {
      return;
    }

    const notification: Notification = {
      title: '',
      tag: 'install' + installation.Id,
      // data: {},
    };

    if (status === 'completed') {
      notification.title = 'PackageInstallCompleted';
      notification.package = {
        name: installation.Name,
        version: installation.Version,
      };
    } else if (status === 'cancelled') {
      notification.title = 'PackageInstallCancelled';
      notification.package = {
        name: installation.Name,
        version: installation.Version,
      };
    } else if (status === 'failed') {
      notification.title = 'PackageInstallFailed';
      notification.package = {
        name: installation.Name,
        version: installation.Version,
      };
    } else if (status === 'progress') {
      notification.title = 'InstallingPackage';
      notification.package = {
        name: installation.Name,
        version: installation.Version,
      };
      const percentComplete = Math.round(installation.PercentComplete || 0);
      notification.body = percentComplete + '% complete.';
    }

    showNotification(notification);
  });
}

jellyfin.Events.on(
  serverNotifications,
  'LibraryChanged',
  function (e, apiClient, data) {
    onLibraryChanged(data, apiClient);
  }
);

jellyfin.Events.on(
  serverNotifications,
  'PackageInstallationCompleted',
  function (e, apiClient, data) {
    showPackageInstallNotification(apiClient, data, 'completed');
  }
);

jellyfin.Events.on(
  serverNotifications,
  'PackageInstallationFailed',
  function (e, apiClient, data) {
    showPackageInstallNotification(apiClient, data, 'failed');
  }
);

jellyfin.Events.on(
  serverNotifications,
  'PackageInstallationCancelled',
  function (e, apiClient, data) {
    showPackageInstallNotification(apiClient, data, 'cancelled');
  }
);

jellyfin.Events.on(
  serverNotifications,
  'PackageInstalling',
  function (e, apiClient, data) {
    showPackageInstallNotification(apiClient, data, 'progress');
  }
);

jellyfin.Events.on(
  serverNotifications,
  'ServerShuttingDown',
  function (e, apiClient) {
    const serverId = apiClient.serverInfo().Id;
    const notification = {
      tag: 'restart' + serverId,
      title: 'ServerNameIsShuttingDown',
      server: apiClient.serverInfo().Name,
    };
    showNotification(notification);
  }
);

jellyfin.Events.on(
  serverNotifications,
  'ServerRestarting',
  function (e, apiClient) {
    const serverId = apiClient.serverInfo().Id;
    const notification = {
      tag: 'restart' + serverId,
      title: 'ServerNameIsRestarting',
      server: apiClient.serverInfo().Name,
    };
    showNotification(notification);
  }
);

jellyfin.Events.on(
  serverNotifications,
  'RestartRequired',
  function (e, apiClient) {
    const serverId = apiClient.serverInfo().Id;
    const notification = {
      tag: 'restart' + serverId,
      title: 'PleaseRestartServerName',
      server: apiClient.serverInfo().Name,
    };

    showNotification(notification);
  }
);

let showNotification: (notification: Notification) => void = () => {
  console.log('default');
};

export function onNotification(
  client: ApiClient,
  callback: (notification: Notification) => void
) {
  showNotification = callback;
}
