/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'node:path';
import fs from 'node:fs';
import { Config } from '@google/gemini-cli-core';
import { getCoreSystemPromptEnhanced } from '../core/prompts-enhanced.js';

/**
 * Enhanced Config class that overrides the system prompt to use the enhanced version
 */
export class EnhancedConfig extends Config {
  /**
   * Override to use enhanced system prompt by setting environment variable
   */
  async initialize(): Promise<void> {
    // Set environment variable to use enhanced system prompt
    const enhancedPromptPath = path.join(process.cwd(), '.gemini', 'enhanced-system.md');
    
    // Create .gemini directory if it doesn't exist
    const geminiDir = path.dirname(enhancedPromptPath);
    if (!fs.existsSync(geminiDir)) {
      fs.mkdirSync(geminiDir, { recursive: true });
    }
    
    // Write enhanced system prompt to file
    const userMemory = this.getUserMemory();
    const enhancedPrompt = getCoreSystemPromptEnhanced(userMemory);
    fs.writeFileSync(enhancedPromptPath, enhancedPrompt);
    
    // Set environment variable to use this file
    process.env.GEMINI_SYSTEM_MD = enhancedPromptPath;
    
    // Call parent initialize
    await super.initialize();
  }
}
