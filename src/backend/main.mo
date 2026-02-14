import Map "mo:core/Map";
import Array "mo:core/Array";

import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Set up authentication, roles and user management
  // (Anonymous, regular user or admin is enforced per function)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  // Portfolio types
  type Investment = {
    id : Nat;
    name : Text;
    amount : Float;
    type_ : InvestmentType;
  };

  type InvestmentType = {
    #stock;
    #bond;
    #realEstate;
    #crypto;
    #cash;
  };

  type UserPortfolio = {
    investments : Map.Map<Nat, Investment>;
    nextId : Nat;
  };

  // Actor state
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userPortfolios = Map.empty<Principal, UserPortfolio>();

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Investment management functions
  public shared ({ caller }) func createInvestmentRecord(name : Text, amount : Float, type_ : InvestmentType) : async Investment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let newId = switch (userPortfolios.get(caller)) {
      case (null) { 1 };
      case (?portfolio) { portfolio.nextId };
    };

    let investment : Investment = {
      id = newId;
      name;
      amount;
      type_;
    };

    let userPortfolio = switch (userPortfolios.get(caller)) {
      case (null) {
        {
          investments = Map.empty<Nat, Investment>();
          nextId = 2;
        };
      };
      case (?portfolio) { { investments = portfolio.investments; nextId = newId + 1 } };
    };

    userPortfolio.investments.add(investment.id, investment);
    userPortfolios.add(caller, userPortfolio);

    investment;
  };

  public query ({ caller }) func listInvestmentRecords() : async [Investment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    switch (userPortfolios.get(caller)) {
      case (null) { [] };
      case (?portfolio) { portfolio.investments.values().toArray() };
    };
  };

  public shared ({ caller }) func updateInvestmentRecord(id : Nat, name : Text, amount : Float, type_ : InvestmentType) : async Investment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    switch (userPortfolios.get(caller)) {
      case (null) { Runtime.trap("No portfolio found") };
      case (?portfolio) {
        switch (portfolio.investments.get(id)) {
          case (null) { Runtime.trap("Investment not found") };
          case (?_) {
            let updatedInvestment : Investment = {
              id;
              name;
              amount;
              type_;
            };

            portfolio.investments.add(id, updatedInvestment);
            updatedInvestment;
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteInvestmentRecord(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    switch (userPortfolios.get(caller)) {
      case (null) { Runtime.trap("No portfolio found") };
      case (?portfolio) {
        if (not portfolio.investments.containsKey(id)) {
          Runtime.trap("Investment not found");
        };
        portfolio.investments.remove(id);
      };
    };
  };
};
