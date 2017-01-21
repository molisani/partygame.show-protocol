declare namespace PartyGameShow {
    namespace Game {
        interface Metadata {
            active: boolean;
            title: string;
            subtitle: string;
            version: string;
            players_min: number;
            players_max?: number;
        }
        interface Loader {
            gametype: string;
            metadata: Metadata;
        }
    }
    interface JoinRequest {
        lobbyCode: string;
        displayName: string;
        uid?: string;
    }
    interface Player {
        uid: string;
        displayName: string;
        color: string;
    }
    interface PlayerMap<T> {
        [uid: string]: T;
    }
    interface Room {
        gametype: string;
        players: Player[];
    }
    interface PlayerScoreEntry {
        score: number;
    }
    namespace Messages {
        interface Payload {
            type: string;
        }
        interface Packet {
            msg_id: string;
            recipient_uids: string[];
            payload: Payload;
            expires_after: number;
            notify: boolean;
        }
        interface ResponsePayload extends Payload {
            author_uid: string;
        }
        interface ResponsePacket {
            msg_id: string;
            player: Player;
            response: ResponsePayload;
        }
    }
    namespace Events {
        interface ToHost {
            player_joined(player: Player): void;
            player_returned(packet: Messages.ResponsePacket): void;
        }
        interface FromHost {
            start_game(room: Room): void;
            end_game(): void;
            send_packet(packet: Messages.Packet): void;
            force_clear(): void;
        }
        interface ToClient {
            player_info(player: Player): void;
            load_game(gametype: string): void;
            unload_game(): void;
            on_packet(packet: Messages.Packet): void;
            on_clear(): void;
        }
        interface FromClient {
            join_room(request: JoinRequest): void;
            return_response(packet: Messages.ResponsePacket): void;
        }
    }
    interface Listener<Events> {
        add_listeners(listeners: Partial<Events>): void;
        remove_listeners(listeners: Partial<Events>): void;
    }
    namespace Services {
        interface Host extends Events.FromHost, Listener<Events.ToHost> {}
        interface Client extends Events.FromClient, Listener<Events.ToClient> {}
    }
    namespace View {
        interface Host {
            start_game(host: Services.Host, players: Player[]): Promise<PlayerMap<PlayerScoreEntry>>;
        }
        interface ClientRequestHandler<P extends Messages.Payload> {
            handle(self: Player, payload: P): Promise<Messages.ResponsePayload>;
        }
        interface Client {
            get_handler(msgType: string): ClientRequestHandler<Messages.Payload>;
        }
    }
}
