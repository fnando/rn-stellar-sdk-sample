import React, {useState} from 'react';
import {StyleSheet, Text, View, Button, Linking} from 'react-native';

import { Operation, Keypair, Network, Server, Account, TransactionBuilder } from "stellar-sdk";

Network.useTestNetwork();

const horizon = new Server("https://horizon-testnet.stellar.org");

export default () => {
  const handleCreate = async () => {
    const sourceKeypair = Keypair.random();
    console.log("=> funding source account", sourceKeypair.publicKey());

    try {
      await fetch(`https://horizon-testnet.stellar.org/friendbot?addr=${sourceKeypair.publicKey()}`);
    } catch (error) {
      console.log("=> ERROR:", error);
    }

    const destinyKeypair = Keypair.random();
    let fee = 100;

    try {
      fee = await horizon.fetchBaseFee();
    } catch (error) {
      console.log("=> ERROR:", error);
    }

    console.log("=> fee is", fee);

    let sourceAccount;

    try {
      console.log("=> fetching account details");
      sourceAccount = await horizon.loadAccount(sourceKeypair.publicKey());
    } catch (error) {
      console.log("=> ERROR:", error);
      throw new Error("Unable to fetch account details");
    }

    console.log("=> source account is", sourceAccount);

    const operation = Operation.createAccount({
      destination: destinyKeypair.publicKey(),
      startingBalance: "2"
    });

    console.log("=> building transaction");

    const transaction = new TransactionBuilder(sourceAccount, { fee })
      .addOperation(operation)
      .setTimeout(5)
      .build();

    console.log("=> signing transaction");
    transaction.sign(sourceKeypair);

    try {
      console.log("=> submitting transaction");
      const result = await horizon.submitTransaction(transaction);
      console.log("=>", result);
    } catch (error) {
      console.log("=> ERROR:", error);
    }

    Linking.openURL(`https://stellar.expert/explorer/testnet/account/${destinyKeypair.publicKey()}`);
  };

  return (
    <View style={styles.container}>
      <Button onPress={handleCreate} title="Create a new account" color="#ff0000" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
