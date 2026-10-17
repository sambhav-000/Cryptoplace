import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma.js';
import { settingsSchema } from '../validators/schemas.js';

export const getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;

    let settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId,
          preferredCurrency: 'usd',
          darkMode: true,
          emailAlerts: true,
        },
      });
    }

    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const validated = settingsSchema.parse(req.body);

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: validated,
      create: {
        userId,
        preferredCurrency: validated.preferredCurrency || 'usd',
        darkMode: validated.darkMode ?? true,
        emailAlerts: validated.emailAlerts ?? true,
      },
    });

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};

