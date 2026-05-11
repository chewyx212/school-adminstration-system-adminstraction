const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'School Administration System API',
    version: '1.0.0',
    description: 'API documentation for the School Administration System assessment backend.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server'
    }
  ],
  tags: [
    {
      name: 'Upload',
      description: 'CSV data import'
    },
    {
      name: 'Classes',
      description: 'Class and student APIs'
    },
    {
      name: 'Reports',
      description: 'Reporting APIs'
    },
    {
      name: 'Health',
      description: 'Health check'
    }
  ],
  paths: {
    '/api/upload': {
      post: {
        tags: ['Upload'],
        summary: 'Upload school administration CSV data',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['data'],
                properties: {
                  data: {
                    type: 'string',
                    format: 'binary',
                    description: 'CSV file to import. Exactly one file is accepted.'
                  }
                }
              }
            }
          }
        },
        responses: {
          '204': {
            description: 'CSV imported successfully'
          },
          '400': {
            description: 'Invalid upload or CSV content',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      }
    },
    '/api/class/{classCode}/students': {
      get: {
        tags: ['Classes'],
        summary: 'List local and external students in a class',
        parameters: [
          {
            name: 'classCode',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: 'P1-1'
            }
          },
          {
            name: 'offset',
            in: 'query',
            required: false,
            schema: {
              type: 'integer',
              minimum: 0,
              default: 0
            }
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 500,
              default: 10
            }
          }
        ],
        responses: {
          '200': {
            description: 'Students returned successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StudentListingResponse'
                }
              }
            }
          },
          '400': {
            description: 'Invalid class code or pagination',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      }
    },
    '/api/class/{classCode}': {
      put: {
        tags: ['Classes'],
        summary: 'Update class name',
        parameters: [
          {
            name: 'classCode',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: 'P1-1'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateClassNameRequest'
              }
            }
          }
        },
        responses: {
          '204': {
            description: 'Class name updated successfully'
          },
          '400': {
            description: 'Invalid class code, request body, or missing class',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      }
    },
    '/api/reports/workload': {
      get: {
        tags: ['Reports'],
        summary: 'Get teacher workload report',
        responses: {
          '200': {
            description: 'Workload report returned successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/WorkloadReportResponse'
                }
              }
            }
          },
          '500': {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      }
    },
    '/api/healthcheck': {
      get: {
        tags: ['Health'],
        summary: 'Check API health',
        responses: {
          '200': {
            description: 'API is healthy'
          }
        }
      }
    }
  },
  components: {
    responses: {
      InternalServerError: {
        description: 'Unexpected server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            }
          }
        }
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'object',
            required: ['code', 'message'],
            properties: {
              code: {
                type: 'string',
                example: 'VALIDATION_ERROR'
              },
              message: {
                type: 'string',
                example: 'CSV validation failed'
              },
              details: {
                description: 'Optional validation details'
              }
            }
          }
        }
      },
      Student: {
        type: 'object',
        required: ['id', 'name', 'email', 'isExternal'],
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          name: {
            type: 'string',
            example: 'Aaron Lee'
          },
          email: {
            type: 'string',
            example: 'aaron.student@example.com'
          },
          isExternal: {
            type: 'boolean',
            example: false
          }
        }
      },
      StudentListingResponse: {
        type: 'object',
        required: ['count', 'students'],
        properties: {
          count: {
            type: 'integer',
            example: 3
          },
          students: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Student'
            }
          }
        }
      },
      UpdateClassNameRequest: {
        type: 'object',
        required: ['className'],
        properties: {
          className: {
            type: 'string',
            example: 'Primary 1 Courage Updated'
          }
        }
      },
      WorkloadReportItem: {
        type: 'object',
        required: ['subjectCode', 'subjectName', 'numberOfClasses'],
        properties: {
          subjectCode: {
            type: 'string',
            example: 'MATH'
          },
          subjectName: {
            type: 'string',
            example: 'Mathematics'
          },
          numberOfClasses: {
            type: 'integer',
            example: 2
          }
        }
      },
      WorkloadReportResponse: {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/WorkloadReportItem'
          }
        },
        example: {
          'Alice Tan': [
            {
              subjectCode: 'MATH',
              subjectName: 'Mathematics',
              numberOfClasses: 2
            }
          ]
        }
      }
    }
  }
};

export default swaggerDocument;
