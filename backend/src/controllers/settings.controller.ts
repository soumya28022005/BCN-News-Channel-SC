// File: backend/src/controllers/settings.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: সেটিং ફેচ করার জন্য
export const getSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const setting = await prisma.siteSettings.findUnique({
      where: { key },
    });

    if (!setting) {
      // যদি ডাটাবেসে কিছু না থাকে, তবে একটি ডিফল্ট টেক্সট পাঠাবে
      return res.status(200).json({ value: "স্বাগতম বেঙ্গল ক্রনিকল নেটওয়ার্কে - সত্যের সাথে, সবসময়..." });
    }

    res.status(200).json(setting);
  } catch (error) {
    console.error("Error fetching setting:", error);
    res.status(500).json({ message: "Failed to fetch setting" });
  }
};

// POST: সেটিং আপডেট করার জন্য (অ্যাডমিন প্যানেল থেকে)
export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;

    if (!key || !value) {
      return res.status(400).json({ message: "Key and value are required" });
    }

    // upsert মানে: ডাটা থাকলে আপডেট করবে, না থাকলে নতুন করে তৈরি করবে
    const setting = await prisma.siteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value, description: "Frontend Ticker Text" },
    });

    res.status(200).json({ success: true, setting });
  } catch (error) {
    console.error("Error updating setting:", error);
    res.status(500).json({ message: "Failed to update setting" });
  }
};