import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { type SignIn, type ExperienceSocialConnector, AgreeToTermsPolicy } from '@logto/schemas';

import LoadingLayer from '@/components/LoadingLayer';
import SocialSignInList from '@/containers/SocialSignInList';
import TermsAndPrivacyCheckbox from '@/containers/TermsAndPrivacyCheckbox';
import useTerms from '@/hooks/use-terms';
import useSocial from '@/containers/SocialSignInList/use-social';

import IdentifierSignInForm from './IdentifierSignInForm';
import PasswordSignInForm from './PasswordSignInForm';
import * as styles from './index.module.scss';

type Props = {
  readonly signInMethods: SignIn['methods'];
  readonly socialConnectors: ExperienceSocialConnector[];
};

const Main = ({ signInMethods, socialConnectors }: Props) => {
  const { agreeToTermsPolicy } = useTerms();
  const { invokeSocialSignIn } = useSocial();
  const { pathname } = useLocation();
  const [searchParameters] = useSearchParams();
  const isPreview = searchParameters.has('preview')
  const isRedirecting = pathname === "/sign-in" && !isPreview && signInMethods.length === 0 && socialConnectors.length === 1

  useEffect(() => {
    if (isRedirecting) {
      socialConnectors[0] && invokeSocialSignIn(socialConnectors[0])
    }
  }, [isRedirecting])

  if (isRedirecting) {
    return <LoadingLayer />
  }

  if (signInMethods.length === 0 && socialConnectors.length > 0) {
    return (
      <>
        <SocialSignInList className={styles.main} socialConnectors={socialConnectors} />
        {
          /**
           * Display agreement checkbox when only social sign-in methods are available
           * and the user needs to agree to terms manually.
           */
          agreeToTermsPolicy === AgreeToTermsPolicy.Manual && (
            <TermsAndPrivacyCheckbox className={styles.checkbox} />
          )
        }
      </>
    );
  }

  const isPasswordOnly =
    signInMethods.length > 0 &&
    signInMethods.every(({ password, verificationCode }) => password && !verificationCode);

  if (isPasswordOnly) {
    return (
      <PasswordSignInForm
        className={styles.main}
        signInMethods={signInMethods.map(({ identifier }) => identifier)}
      />
    );
  }

  if (signInMethods.length > 0) {
    return <IdentifierSignInForm className={styles.main} signInMethods={signInMethods} />;
  }

  return null;
};

export default Main;
