/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box, Text } from 'ink';
import { Colors } from '../colors.js';

interface TodoItem {
  id: string;
  description: string;
  status: 'not_made' | 'in_progress' | 'made';
}

interface TodoListDisplayProps {
  todos: TodoItem[];
  width?: number;
}

const getStatusIcon = (status: TodoItem['status']): string => {
  switch (status) {
    case 'not_made':
      return '⭕';
    case 'in_progress':
      return '🔄';
    case 'made':
      return '✅';
    default:
      return '⭕';
  }
};

const getStatusColor = (status: TodoItem['status']): string => {
  switch (status) {
    case 'not_made':
      return Colors.AccentYellow;
    case 'in_progress':
      return Colors.AccentBlue;
    case 'made':
      return Colors.AccentGreen;
    default:
      return Colors.AccentYellow;
  }
};

export const TodoListDisplay: React.FC<TodoListDisplayProps> = ({
  todos,
  width = 80,
}) => {
  if (!todos || todos.length === 0) {
    return null;
  }

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={Colors.AccentBlue}
      paddingX={1}
      marginBottom={1}
      width={width}
    >
      <Box marginBottom={1}>
        <Text bold color={Colors.AccentBlue}>
          📋 TODO List
        </Text>
      </Box>
      
      {todos.map((todo, index) => (
        <Box key={todo.id || index} marginBottom={index < todos.length - 1 ? 1 : 0}>
          <Box marginRight={1}>
            <Text color={getStatusColor(todo.status)}>
              {getStatusIcon(todo.status)}
            </Text>
          </Box>
          <Box flexGrow={1}>
            <Text
              color={todo.status === 'made' ? Colors.Comment : Colors.Foreground}
              strikethrough={todo.status === 'made'}
            >
              {todo.description}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
