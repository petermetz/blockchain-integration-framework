# Hyperledger Cactus Roadmap

A living document with the maintainers' plans regarding the general direction of the project:

![](https://media.giphy.com/media/llmrnMkLqcssM6sYG7/giphy-downsized.gif)

## Can I Add Things to the Roadmap?

If you take on the burden of implementing a feature yourself no one should stop you from adding it here as well, as long as the majority of the maintainers also agree that it is something that has a place in the framework.

For example: 
* Support being added for new ledgers by implementing new connector plugins is always welcome.
* On the other hand, if you want to repurpose Cactus to be the operating system for a driverless ice-cream truck you are developing that that **may** not get accepted by the maintainers even if you are happy to do all the work yourself. 

# Quarterly Breakdown

## Terminology

Quarters are defined as:

- **Q1**: January, February, March
- **Q2**: April, May, June
- **Q3**: July, August, September
- **Q4**: October, November, December

Halves are defined as:

- **H1**: Q1+Q2
- **H2**: Q3+Q4

## 2021 Q1

**Features:** 

1. Language Agnostic Plugin Development
    * Vault Keychain Plugin written in Rust as a proof of concept
1. HTLC plugin for Besu
    * ETH
    * ERC-20
1. Corda Open Source Ledger Connector Plugin 
    * Flow Invocation
    * CordApp Deployment 
1. Prometheus Monitoring
1. Sawtooth Validator
    * Block monitoring feature
    * (Transaction request feature will be added later)
1. test docker container for Sawtooth
1. VerifierFactory
    * to adapt Verifier to both of socket.io-typed Validator and OpenAPI-typed Validator
1. BLP/electricity-trade
    * BLP application integrating with Ethereum and Sawtooth
1. prototype codes of auto-testing framework using Jest

**Fixes:**

1. Fabric 2.x Contract Deployment
1. car-trade execution procedures

**Security Fixes**

1. Current vulnerable dependencies to be updated or removed (recurring roadmap item)

**Documentation**

1. Extend supply chain app example package with Fabric elements


## 2021 Q2

**Features**

1. Minimum Viable AuthN/AuthZ via OpenID Connect
1. Indy powered Consortium Plugin Implementation
    * With at least one of the examples using it as well
1. Kubernetes Integration
    * Helm Charts
    * KNative
    * Minikube based end to end testing
1. Public Test Deployment of a Cactus Consortium
    * Multiple nodes
    * Public domain: https://cactus.stream
1. Keychain Plugin Implementations:
    * AWS Secret Manager
1. Indy Validator
1. test docker container for Indy
1. test docker container for Iroha

**Fixes:**

`N/A`

**Security Fixes**:

1. Current vulnerable dependencies to be updated or removed (recurring roadmap item)
2. SSH host key verification for 
    * Fabric contract deployment
    * Corda contract deployment

**Documentation**

1. Climate Action SIG Example Implementation
2. Atomic Swaps Example
    * CBDC, bonds for cash
3. Cloud deployment playbook
4. Cactus ReadTheDocs Site

## 2021 Q3

**Checking points for releasing V1-RC**

* **Validator**
    - Validators for Hyperledger ledgers (Fabric, Sawtooth, Besu, Indy, Iroha), Quorum, and Corda

* **Verifier**
    - All sync/async requests from BLP must communicate with  Validator (toward ledgers) via Verifier
    - transaction signer features for Hyperledger ledgers (Fabric, Sawtooth, Besu, Indy, Iroha), Quorum, and Corda

* **BLP-attached optional plugins**

* **BLP applications**
    - BLP applications using each ledger of Hyperledger ledgers (Fabric, Sawtooth, Besu, Indy, Iroha), Quorum, and Corda

* **Test ledger tools**
    - Ledger tools for Hyperledger ledgers (Fabric, Sawtooth, Besu, Indy, Iroha), Quorum, and Corda

* **Service API and Admin API**
    - SDK for BLP
    - SDK for LedgerPlugin

* **Support tools**

* **Error handing**
    - (Error cases will be listed soon)

* **Others**
    - Dockernize
    - Method for providing packages
    - refactor config files on /etc/cactus of server directory

**Features**

1. Keychain Plugin Implementations:
    * Azure Key Vault
1. Corda Enterprise Support
1. Besu Private Transactions
1. Fabric Private Transactions
1. Federated Authentication: SAML **and/or** LDAP
1. transaction signer features
    * Hyperledger ledgers (Iroha, Sawtooth, Fabric v2, Indy, Quorum, Corda)
1. Corda Enterprise Support
1. SDK for BLP
1. SDK for LedgerPlugin
1. Dockernize
1. Method for providing packages
1. refactor config files on /etc/cactus of server directory
1. Error Handling

**Fixes:**

**Security Fixes**:

1. Current vulnerable dependencies to be updated or removed (recurring roadmap item)

**Documentation**

## 2021 Q4

**Features**

**Fixes:**

**Security Fixes**:

1. Current vulnerable dependencies to be updated or removed (recurring roadmap item)

**Documentation**