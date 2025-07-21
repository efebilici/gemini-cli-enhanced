/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Config } from '@google/gemini-cli-core';

interface TodoItem {
  id: string;
  description: string;
  status: 'not_made' | 'in_progress' | 'made';
}

export const useTodoList = (config: Config) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const toolRegistry = await config.getToolRegistry();
      const todoTool = toolRegistry.getTool('todo_tool');
      
      if (todoTool) {
        // Call the get_steps action to get current todos
        const result = await todoTool.execute({
          action: 'get_steps'
        }, new AbortController().signal);
        
        if (result.llmContent) {
          // Parse the JSON response from llmContent
          const llmContentStr = typeof result.llmContent === 'string' ? result.llmContent : JSON.stringify(result.llmContent);
          const todoData = JSON.parse(llmContentStr);
          if (todoData.success && todoData.steps && Array.isArray(todoData.steps)) {
            const formattedTodos: TodoItem[] = todoData.steps.map((step: any, index: number) => ({
              id: step.id || `todo-${index}`,
              description: step.description || step.title || 'Untitled task',
              status: step.status === 'made' ? 'made' : 
                     step.status === 'in_progress' ? 'in_progress' : 'not_made'
            }));
            setTodos(formattedTodos);
          } else {
            setTodos([]);
          }
        }
      }
    } catch (error) {
      // Silently handle errors - TODO tool might not be available
      console.debug('Failed to fetch todos:', error);
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
    
    // Set up periodic refresh every 10 seconds to keep TODO list updated
    const interval = setInterval(fetchTodos, 10000);
    
    return () => clearInterval(interval);
  }, []); // Remove config dependency to prevent re-renders on every keystroke

  return {
    todos,
    isLoading,
    refreshTodos: fetchTodos
  };
};
