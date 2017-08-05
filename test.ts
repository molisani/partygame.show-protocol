
import { expect } from "chai";

import { buildMockEnvironment, ConsoleLogger, NullLogger } from "./mock";

describe("Host", () => {

  describe("on startup", () => {

    const logger = new NullLogger();

    const env = buildMockEnvironment([], logger);

    it("should list available games", () => {
      return env.hostApp.listGames().then(() => {
        expect(env.hostSpy.availableGames.getCall(0).args[0].games[0]).to.deep.equal({
          gametype: "sketchy",
          metadata: {
            active: true,
            title: "#sketchy",
            subtitle: "sketchy subtitle",
            minPlayers: 3,
            version: "1.0.0",
          },
        });
      });
    });

  });

  describe("with single user", () => {

    const logger = new NullLogger();

    const player = {
      playerID: "player-0",
      displayName: "player-0",
      color: "#000000",
    };

    const env = buildMockEnvironment([
      {
        info: player,
        responses: Object.create(null),
      },
    ], logger);

    const startRoom = env.hostApp.startRoom();

    it("should start room", () => {
      return startRoom.then((room) => {
        expect(env.hostSpy.onRoom.getCall(0).args[0]).to.deep.equal(room);
      });
    });

    it("should connect player", () => {
      return startRoom.then((room) => {
        env.clientConnections.forEach((client) => {
          client.service.joinLobby({
            playerID: client.playerID,
            lobbyCode: room.lobbyCode,
          });
        });
        return new Promise((resolve) => {
          env.hostApp.addPlayerJoinedLobbyListener(resolve);
        });
      }).then(() => {
        expect(env.hostSpy.playerJoinedLobby.getCall(0).args[0]).to.deep.equal(player);
      });
    });

  });

  describe("with multiple users", () => {

    const logger = new NullLogger();

    const players = [
      {
        playerID: "player-0",
        displayName: "player-0",
        color: "#000000",
      },
      {
        playerID: "player-1",
        displayName: "player-1",
        color: "#000000",
      },
      {
        playerID: "player-2",
        displayName: "player-2",
        color: "#000000",
      },
    ];

    const env = buildMockEnvironment(players.map((player) => {
      return {
        info: player,
        responses: {
          msg0: {
            authorID: player.playerID,
            type: "test",
          },
        },
      };
    }), logger);

    const startRoom = env.hostApp.startRoom();

    it("should start room", () => {
      return startRoom.then((room) => {
        expect(env.hostSpy.onRoom.getCall(0).args[0]).to.deep.equal(room);
      });
    });

    const playersConnected = startRoom.then((room) => {
      env.clientConnections.forEach((client) => {
        client.service.joinLobby({
          playerID: client.playerID,
          lobbyCode: room.lobbyCode,
        });
      });
      const joined = players.map((player) => {
        return new Promise((resolve) => {
          env.hostApp.addPlayerJoinedLobbyListener((p) => {
            if (p.playerID === player.playerID) {
              resolve(p);
            }
          });
        });
      });
      return Promise.all(joined);
    });

    it("should connect player", () => {
      return playersConnected.then(() => {
        const calledArgs = env.hostSpy.playerJoinedLobby.getCalls().map((call) => call.args[0]);
        expect(calledArgs).to.have.same.deep.members(players);
      });
    });

    const startGame = playersConnected.then(() => {
      return env.hostApp.startGame({
        playerIDs: players.map((player) => player.playerID),
        gametype: "test-gametype",
      });
    });

    it("should start game", () => {
      return startGame.then(() => {
        const calledArgs = env.hostSpy.playerReady.getCalls().map((call) => call.args[0]);
        expect(calledArgs).to.have.same.deep.members(players);
        expect(env.hostSpy.gameContent.getCall(0).args[0]).to.deep.equal({
          base: {
            packID: "test-gametype-base",
            data: {
              content: "BASE",
            },
          },
          extra: [
            {
              packID: "test-gametype-extra:0",
              data: {
                content: "EXTRA-0",
              },
            },
            {
              packID: "test-gametype-extra:1",
              data: {
                content: "EXTRA-1",
              },
            },
          ],
        });
      });
    });

    const processMessages = startGame.then(() => {
      return env.hostApp.sendPacket({
        msgID: "msg0",
        expiresAfter: 0,
        notify: true,
        recipientIDs: players.map((player) => player.playerID),
        payload: {
          type: "test",
        },
      });
    });

    it("should send/receive messages", () => {
      return processMessages.then((response) => {
        expect(response).to.deep.equal(players.reduce((res, player) => {
          res[player.playerID] = {
            msgID: "msg0",
            playerID: player.playerID,
            response: {
              authorID: player.playerID,
              type: "test",
            },
          };
          return res;
        }, Object.create(null)));
        const calledArgs = env.hostSpy.playerReturned.getCalls().map((call) => call.args[0]);
        expect(calledArgs).to.have.same.deep.members(players.map((player) => {
          return {
            msgID: "msg0",
            playerID: player.playerID,
            response: {
              authorID: player.playerID,
              type: "test",
            },
          };
        }));
      });
    });

  });

});
