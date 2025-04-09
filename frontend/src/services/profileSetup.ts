
import { message, sampleID } from '@/utils'
import * as Defaults from '@/constant'
import {
  useProfilesStore,
  useAppSettingsStore,
  useSubscribesStore,
  type SubscribeType,
  type ProfileType,
} from '@/stores'
export const setupInitialProfile = async (subscribeUrl: string,token: string, onComplete?: () => void) => {
  const subscribeStore = useSubscribesStore();
  const profilesStore = useProfilesStore();
  const appSettingsStore = useAppSettingsStore();



  const subscribe: SubscribeType = {
      id: token,
      name: "悄咪咪云",
      useInternal: false,
      upload: 0,
      download: 0,
      total: 0,
      expire: 0,
      updateTime: 0,
      type: 'Http',
      url: subscribeUrl,
      website: '',
      path: `data/subscribes/${token}.yaml`,
      include: '',
      exclude: '',
      includeProtocol: '',
      excludeProtocol: '',
      proxyPrefix: '',
      disabled: false,
      inSecure: false,
      userAgent: 'meta',
      healthCheck: {
        enable: false,
        url: 'https://www.gstatic.com/generate_204',
        interval: 300,
      },
      proxies: [],
  };


  try {
    const subc = subscribeStore.getSubscribeById(token);
    if (subc) {
      await subscribeStore.updateSubscribe(subc.id);
      if (onComplete) onComplete();

      return true;
    }else{
      await subscribeStore.addSubscribe(subscribe);
      await subscribeStore.updateSubscribe(subscribe.id);
    }
  } catch (error: any) {
    console.log(error);
    message.error(error);
    subscribeStore.deleteSubscribe(token);
    return false;
  }

  const ids = [sampleID(), sampleID(), sampleID(), sampleID(), sampleID()];
  const profile: ProfileType = {
    id: token,
    name: '悄咪咪云',
    generalConfig: Defaults.GeneralConfigDefaults(),
    advancedConfig: Defaults.AdvancedConfigDefaults(),
    tunConfig: Defaults.TunConfigDefaults(),
    dnsConfig: Defaults.DnsConfigDefaults(),
    proxyGroupsConfig: Defaults.ProxyGroupsConfigDefaults(ids),
    rulesConfig: Defaults.RulesConfigDefaults(ids),
    mixinConfig: Defaults.MixinConfigDefaults(),
    scriptConfig: Defaults.ScriptConfigDefaults(),
  };

  profile.proxyGroupsConfig[0].use = [token];
  profile.proxyGroupsConfig[1].use = [token];

  await profilesStore.addProfile(profile);

  appSettingsStore.app.kernel.profile = profile.id;

  message.success('home.initSuccessful');

  if (onComplete) onComplete();
  
  return true;
}
