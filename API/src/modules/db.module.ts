import {Connection, createConnection} from "mariadb";
import {App} from "~/server";
import {Logger} from "pino";
import {API_Error} from "~/types/errors";

export class DbModule {

    App: App
    logger: Logger
    DB_Client: Connection

    constructor(mainClass: App) {
        this.App = mainClass;
        this.logger = this.App.AppLogger.createChildLogger(this.constructor.name);

        this.connectToDB()
    }

    async connectToDB() {
        this.logger.info(`Connecting to DataBase on ${this.App.config.db.host}`)
        try {
          this.DB_Client = await createConnection({
              host: this.App.config.db.host,
              user: this.App.config.db.username,
              password: this.App.config.db.password,
              port: this.App.config.db.port
          })
        } catch (e) {
          this.logger.error('Unable to connect to DB : ', e)
        }
    }

    async dbTableQuery(table: string, sort?: { column: string, order: "ASC" | "DESC" }): Promise<any[]> {
        let SQL_Query_String = `SELECT * FROM ${table}`;
        if (sort) {
            SQL_Query_String += ` ORDER BY ${sort.column} ${sort.order}`;
        }

        try {
            const rows = await this.DB_Client.query(SQL_Query_String);
            return rows; // Return the rows fetched from the database
        } catch (err) {
            throw new API_Error(
                'DATABASE_ERROR',
                'Une erreur est survenue lors de la récupération de données depuis la BDD',
                { cause: err }
            );
        }
    }

}
