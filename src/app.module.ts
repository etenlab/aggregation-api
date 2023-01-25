import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        // ... Apollo server options
        cors: true,
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'notifications',
              url: process.env.SUBGRAPH_NOTIFICATION_URL,
            },
            { name: 'discussions', url: process.env.SUBGRAPH_DISCUSSION_URL },
            { name: 'site_text', url: process.env.SUBGRAPH_SITE_TEXT_URL },
            { name: 'voting', url: process.env.SUBGRAPH_VOTING_URL },
            { name: 'scripture', url: process.env.SUBGRAPH_SCRIPTURE_URL },
          ],
        }),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
