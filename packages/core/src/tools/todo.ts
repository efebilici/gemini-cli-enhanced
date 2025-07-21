/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseTool, Icon, ToolResult } from './tools.js';
import { FunctionDeclaration, Type } from '@google/genai';

export enum TodoStatus {
  NOT_MADE = 'not_made',
  IN_PROGRESS = 'in_progress',
  MADE = 'made'
}

export interface TodoStep {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
}

export class TodoManager {
  private static instance: TodoManager;
  private steps: TodoStep[] = [];
  private nextId = 1;

  private constructor() {}

  static getInstance(): TodoManager {
    if (!TodoManager.instance) {
      TodoManager.instance = new TodoManager();
    }
    return TodoManager.instance;
  }

  initializeTodo(steps: Array<{ title: string; description: string }>): void {
    this.steps = steps.map((step, index) => ({
      id: (index + 1).toString(),
      title: step.title,
      description: step.description,
      status: TodoStatus.NOT_MADE
    }));
    this.nextId = this.steps.length + 1;
  }

  addStep(title: string, description: string): string {
    const id = this.nextId.toString();
    this.steps.push({
      id,
      title,
      description,
      status: TodoStatus.NOT_MADE
    });
    this.nextId++;
    return id;
  }

  deleteStep(id: string): boolean {
    const index = this.steps.findIndex(step => step.id === id);
    if (index !== -1) {
      this.steps.splice(index, 1);
      return true;
    }
    return false;
  }

  updateStatus(id: string, status: TodoStatus): boolean {
    const step = this.steps.find(step => step.id === id);
    if (step) {
      step.status = status;
      return true;
    }
    return false;
  }

  getSteps(): TodoStep[] {
    return [...this.steps];
  }

  getStepsForDisplay(): string {
    if (this.steps.length === 0) {
      return '';
    }

    return this.steps.map(step => {
      const icon = this.getStatusIcon(step.status);
      return `${icon} ${step.title}`;
    }).join('\n');
  }

  private getStatusIcon(status: TodoStatus): string {
    switch (status) {
      case TodoStatus.NOT_MADE:
        return '⭕';
      case TodoStatus.IN_PROGRESS:
        return '🔄';
      case TodoStatus.MADE:
        return '✅';
      default:
        return '⭕';
    }
  }

  clearTodo(): void {
    this.steps = [];
    this.nextId = 1;
  }
}

const todoToolSchemaData: FunctionDeclaration = {
  name: 'todo_tool',
  description: 'Manage TODO list for task planning and tracking. Initialize, add, delete steps, or change status.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: {
        type: Type.STRING,
        description: 'Action to perform: initialize, add, delete, update_status, get_steps, clear',
        enum: ['initialize', 'add', 'delete', 'update_status', 'get_steps', 'clear']
      },
      steps: {
        type: Type.ARRAY,
        description: 'Array of steps for initialization (only used with initialize action)',
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Step title' },
            description: { type: Type.STRING, description: 'Step description' }
          },
          required: ['title', 'description']
        }
      },
      step_id: {
        type: Type.STRING,
        description: 'Step ID for delete or update_status actions'
      },
      title: {
        type: Type.STRING,
        description: 'Step title for add action'
      },
      description: {
        type: Type.STRING,
        description: 'Step description for add action'
      },
      status: {
        type: Type.STRING,
        description: 'New status for update_status action',
        enum: ['not_made', 'in_progress', 'made']
      }
    },
    required: ['action']
  }
};

const todoToolDescription = `
Manage TODO list for task planning and tracking.

Actions:
- initialize: Create a new TODO list with initial steps
- add: Add a new step to the TODO list
- delete: Remove a step from the TODO list
- update_status: Change the status of a step (not_made, in_progress, made)
- get_steps: Get all current steps
- clear: Clear the entire TODO list

Status values:
- not_made: ⭕ (Red circle) - Step not started
- in_progress: 🔄 (Blue arrows) - Step currently being worked on
- made: ✅ (Green checkmark) - Step completed

The TODO list is automatically cleared when returning to the main prompt screen.
`;

interface TodoToolParams {
  action: 'initialize' | 'add' | 'delete' | 'update_status' | 'get_steps' | 'clear';
  steps?: Array<{ title: string; description: string }>;
  step_id?: string;
  title?: string;
  description?: string;
  status?: 'not_made' | 'in_progress' | 'made';
}

export class TodoTool extends BaseTool<TodoToolParams, ToolResult> {
  static readonly Name: string = todoToolSchemaData.name!;
  
  constructor() {
    super(
      TodoTool.Name,
      'TODO Tool',
      todoToolDescription,
      Icon.CheckCircle,
      todoToolSchemaData.parameters as Record<string, unknown>,
    );
  }

  async execute(
    params: TodoToolParams,
    _signal: AbortSignal,
  ): Promise<ToolResult> {
    const todoManager = TodoManager.getInstance();

    try {
      switch (params.action) {
        case 'initialize':
          if (!params.steps || !Array.isArray(params.steps)) {
            return {
              llmContent: JSON.stringify({ success: false, error: 'Steps array required for initialize action' }),
              returnDisplay: 'Error: Steps array required for initialize action',
            };
          }
          todoManager.initializeTodo(params.steps);
          return {
            llmContent: JSON.stringify({ 
              success: true, 
              message: `Initialized TODO list with ${params.steps.length} steps`,
              steps: todoManager.getSteps()
            }),
            returnDisplay: `TODO list initialized with ${params.steps.length} steps`,
          };

        case 'add':
          if (!params.title || !params.description) {
            return {
              llmContent: JSON.stringify({ success: false, error: 'Title and description required for add action' }),
              returnDisplay: 'Error: Title and description required for add action',
            };
          }
          const newId = todoManager.addStep(params.title, params.description);
          return {
            llmContent: JSON.stringify({ 
              success: true, 
              message: `Added step: ${params.title}`,
              step_id: newId
            }),
            returnDisplay: `Added step: ${params.title}`,
          };

        case 'delete':
          if (!params.step_id) {
            return {
              llmContent: JSON.stringify({ success: false, error: 'Step ID required for delete action' }),
              returnDisplay: 'Error: Step ID required for delete action',
            };
          }
          const deleted = todoManager.deleteStep(params.step_id);
          if (deleted) {
            return {
              llmContent: JSON.stringify({ success: true, message: `Deleted step ${params.step_id}` }),
              returnDisplay: `Deleted step ${params.step_id}`,
            };
          } else {
            return {
              llmContent: JSON.stringify({ success: false, error: `Step ${params.step_id} not found` }),
              returnDisplay: `Error: Step ${params.step_id} not found`,
            };
          }

        case 'update_status':
          if (!params.step_id || !params.status) {
            return {
              llmContent: JSON.stringify({ success: false, error: 'Step ID and status required for update_status action' }),
              returnDisplay: 'Error: Step ID and status required for update_status action',
            };
          }
          const statusEnum = params.status as TodoStatus;
          const updated = todoManager.updateStatus(params.step_id, statusEnum);
          if (updated) {
            return {
              llmContent: JSON.stringify({ 
                success: true, 
                message: `Updated step ${params.step_id} status to ${params.status}` 
              }),
              returnDisplay: `Updated step ${params.step_id} status to ${params.status}`,
            };
          } else {
            return {
              llmContent: JSON.stringify({ success: false, error: `Step ${params.step_id} not found` }),
              returnDisplay: `Error: Step ${params.step_id} not found`,
            };
          }

        case 'get_steps':
          const steps = todoManager.getSteps();
          return {
            llmContent: JSON.stringify({ 
              success: true, 
              steps: steps,
              display: todoManager.getStepsForDisplay()
            }),
            returnDisplay: steps.length > 0 ? todoManager.getStepsForDisplay() : 'No TODO steps',
          };

        case 'clear':
          todoManager.clearTodo();
          return {
            llmContent: JSON.stringify({ success: true, message: 'TODO list cleared' }),
            returnDisplay: 'TODO list cleared',
          };

        default:
          return {
            llmContent: JSON.stringify({ success: false, error: `Unknown action: ${params.action}` }),
            returnDisplay: `Error: Unknown action: ${params.action}`,
          };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        llmContent: JSON.stringify({ success: false, error: errorMessage }),
        returnDisplay: `Error: ${errorMessage}`,
      };
    }
  }
}
