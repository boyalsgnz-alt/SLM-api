import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Organization } from '../schemas/organization.schema';
import { Roles } from '../decorators/roles.decorator';
import { OrganizationService } from './organization.service';
import { RolesGuard } from '../guards/roles.guard';
import type { Request } from 'express';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { User } from '../schemas/user.schema';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['super-admin'])
  @Get()
  async getAllOrganizations(): Promise<Organization[]> {
    return this.organizationService.getAllOrganizations();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMyOrganizations(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Organization[] | null> {
    if (user) {
      return this.organizationService.getMyOrganizations(user);
    }
    return null;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrganization(
    @Req() req: Request,
    @Body() orgDto: CreateOrganizationDto,
  ): Promise<Organization | null> {
    if (req.user) {
      return this.organizationService.createOrganization(orgDto, req.user);
    }
    return null;
  }
}
