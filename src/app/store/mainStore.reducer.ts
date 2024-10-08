import { createReducer, createFeatureSelector, createSelector, on } from '@ngrx/store';
import { AuthService } from '../services/authService/authService.service';
import * as actions from './mainStore.actions';

export interface UserPrivileges {
  WaseelPrivileges: {
    isPAM: boolean,
    isNphiesAdmin: boolean,
    RCM: {
      isAdmin: boolean,
      scrubbing: {
        isAdmin: boolean,
        isDoctor: boolean,
        isCoder: boolean
      }
    }
  };
  ProviderPrivileges: {
    chronicDisease: {
      isCDM: false,
      isCDMAdmin: false,
      isCDMConfig : false
    },
    Contract_Bill: {
      isAdmin: false,
      canAccessContract: false,
      canAccessPolicy: false,
      canAccessClass: false,
      canAccessBilling: false,
    },
    WASEEL_CLAIMS: {
      isAdmin: boolean,
      isClaimUser: boolean,
      isPayerUser: boolean

    },
    GSSReportForTawuniya: {
      canAccessGSSReport: false
    }
    RCM: {
      isAdmin: boolean,
      canAccessRevenueReport: boolean,
      canAccessCollectionManagement: boolean
    },
    NPHIES: {
      isAdmin: boolean,
      canAccessEligibility: boolean,
      canAccessViewEligibility:boolean,
      canAccessPreAuthorization: boolean,
      canAccessViewPreAuthorization:boolean,
      canAccessClaim: boolean,
      canAccessViewClaim:boolean,
      canAccessBeneficiary: boolean,
      canAccessPaymentReconciliation: boolean,
      canAccessConfigurations: boolean,
      canAccessPriceList: boolean,
      canAccessPhysician: boolean,
      canAccessDaysOfSupply: boolean,
      canAccessCodeMapping: boolean,
      canAccessConvertPreAuthToClaim: boolean,
      canAccessPrepareClaim: boolean,
      canAccessConvertClaim: boolean,
      canSwitchGroupProvider: boolean,
      isHeadOffice: boolean,
    }
  };
}

export interface MainState {
  headerAndSideMenuIsHidden: boolean;
  userPrivileges: UserPrivileges
}

export const initState: MainState = {
  headerAndSideMenuIsHidden: false,
  userPrivileges: {
    WaseelPrivileges: {
      isPAM: false,
      isNphiesAdmin:false,
      RCM: {
        isAdmin: false,
        scrubbing: {
          isAdmin: false,
          isCoder: false,
          isDoctor: false
        }
      }
    },
    ProviderPrivileges: {
      chronicDisease: {
        isCDM: false,
        isCDMAdmin: false,
        isCDMConfig : false
      },
      Contract_Bill: {
        isAdmin: false,
        canAccessContract: false,
        canAccessPolicy: false,
        canAccessClass: false,
        canAccessBilling: false,
      },
      WASEEL_CLAIMS: {
        isAdmin: false,
        isClaimUser: false,
        isPayerUser: false

      },
      GSSReportForTawuniya: {
        canAccessGSSReport: false
      },
      RCM: {
        isAdmin: false,
        canAccessRevenueReport: false,
        canAccessCollectionManagement: false
      },
      NPHIES: {
        isAdmin: false,
        canAccessEligibility: false,
        canAccessViewEligibility:false,
        canAccessPreAuthorization: false,
        canAccessViewPreAuthorization: false,
        canAccessClaim: false,
        canAccessViewClaim:false,
        canAccessBeneficiary: false,
        canAccessPaymentReconciliation: false,
        canAccessConfigurations: false,
        canAccessPriceList: false,
        canAccessPhysician: false,
        canAccessDaysOfSupply: false,
        canAccessCodeMapping: false,
        canAccessConvertPreAuthToClaim: false,
        canAccessPrepareClaim: false,
        canAccessConvertClaim: false,
        canSwitchGroupProvider: false,
        isHeadOffice: false,
      }
    }
  }
};

const _mainReducer = createReducer(
  initState,
  on(actions.hideHeaderAndSideMenu, (state) => ({ ...state, headerAndSideMenuIsHidden: true })),
  on(actions.showHeaderAndSideMenu, (state) => ({ ...state, headerAndSideMenuIsHidden: false })),
  on(actions.evaluateUserPrivileges, (state) => {
    const parentProviderId = localStorage.getItem('parentProviderId');
    const providerId = localStorage.getItem('provider_id');
    const payerIds = AuthService.getPayersList().map(payer => `${payer.id}`);
    const userPrivileges = {
      WaseelPrivileges: {
        isPAM: AuthService.hasPrivilege('101', '101', '22'),
        isNphiesAdmin:AuthService.hasPrivilege('101', '101', '25.99'),
        RCM: {
          isAdmin: AuthService.hasPrivilege('101', '101', '24.0'),
          scrubbing: {
            isDoctor: AuthService.hasPrivilege('101', '101', '24.41'),
            isCoder: AuthService.hasPrivilege('101', '101', '24.42'),
            isAdmin: AuthService.hasPrivilege('101', '101', '24.43'),
          }
        }
      },
      ProviderPrivileges: {
        chronicDisease: {
          isCDM: providerId != '102' && AuthService.hasPrivilege(providerId, '102', '90.0'),
          isCDMAdmin : providerId != '101' && AuthService.hasPrivilege(providerId, '101', '90.1'),
          isCDMConfig : providerId != '102' && AuthService.hasPrivilege(providerId, '102', '90.2')
        },
        Contract_Bill: {
          isAdmin: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '27'),
          canAccessContract: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '27'),
          canAccessPolicy: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '28'),
          canAccessClass: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '29'),
          canAccessBilling: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '30'),
        },
        WASEEL_CLAIMS: {
          isAdmin: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '3.0'),
          isClaimUser: providerId != '101' && payerIds.some(payerId => AuthService.hasPrivilege(providerId, payerId, '3')),
          isPayerUser: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '99.0'),
        },
        GSSReportForTawuniya: {
          canAccessGSSReport: AuthService.hasPrivilege(providerId, '102', '31.0') || AuthService.hasPrivilege(providerId, '101', '31.0')
        },
        RCM: {
          isAdmin: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '24.0'),
          canAccessRevenueReport: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '24.1'),
          canAccessCollectionManagement: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '24.0')
        },
        NPHIES: {
          isAdmin: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '25.0'),
          canAccessEligibility: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '25.1'),
          canAccessViewEligibility:providerId != '101' && AuthService.hasPrivilege(providerId, '101', '25.81'),
          canAccessPreAuthorization: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '25.2'),
          canAccessViewPreAuthorization:providerId != '101' && AuthService.hasPrivilege(providerId, '101', '25.82'),
          canAccessClaim: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '25.3'),
          canAccessViewClaim:providerId != '101' && AuthService.hasPrivilege(providerId, '101', '25.83'),
          canAccessBeneficiary: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '25.4'),
          canAccessPaymentReconciliation: providerId != '101' && AuthService.hasPrivilege(providerId, '101', '25.5'),
          canAccessConfigurations: providerId != '101' && (AuthService.hasPrivilege(providerId, '101', '25.6')),
          canAccessPriceList: providerId != '101' && (AuthService.hasPrivilege(providerId, '101', '25.61')),
          canAccessPhysician: providerId != '101' && (AuthService.hasPrivilege(providerId, '101', '25.62')),
          canAccessDaysOfSupply: providerId != '101' && (AuthService.hasPrivilege(providerId, '101', '25.63')),
          canAccessCodeMapping: providerId != '101' && (AuthService.hasPrivilege(providerId, '101', '25.64')),
          canAccessConvertPreAuthToClaim: providerId != '101' && (AuthService.hasPrivilegeSubString(providerId, '101', '25.7')),
          canAccessPrepareClaim: providerId != '101' && (AuthService.hasPrivilegeSubString(providerId, '101', '25.71')),
          canAccessConvertClaim: providerId != '101' && (AuthService.hasPrivilegeSubString(providerId, '101', '25.72')),
          canSwitchGroupProvider: providerId != '101' && (AuthService.hasPrivilegeSubString(parentProviderId, '101', '32.0')),
          isHeadOffice: providerId != '101' && AuthService.isProviderHeadOffice(),
        }
      }
    };
    return { ...state, userPrivileges: userPrivileges };
  })
);

export function mainReducer(state, action) {
  return _mainReducer(state, action);
}

export const MainStateSelector = createFeatureSelector<MainState>('mainState');

export const isHeaderAndSideMenuHidden = createSelector(MainStateSelector, (state) => state.headerAndSideMenuIsHidden);

export const getUserPrivileges = createSelector(MainStateSelector, (state) => state.userPrivileges);
