# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of the BDIX Connectivity Tester seriously. If you believe you have found a security vulnerability in this project, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

### Reporting Process

1. **Email**: Send an email to [security@bdixtester.com](mailto:security@bdixtester.com) with the subject line "BDIX Tester Security Vulnerability"
2. **Include**: 
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any proof-of-concept code if applicable
   - Your contact information

### What to Expect

- **Acknowledgment**: You will receive an acknowledgment of your report within 48 hours
- **Assessment**: Our security team will assess the vulnerability and determine its severity
- **Timeline**: We aim to resolve critical vulnerabilities within 30 days
- **Updates**: You will receive periodic updates on the status of the fix
- **Disclosure**: We will coordinate with you on the disclosure timeline

### Security Measures

#### Data Privacy
- No personal data is collected or stored
- All testing occurs client-side in the user's browser
- No server-side processing of user data
- Test results are stored locally in the browser

#### Secure Coding Practices
- Input validation and sanitization
- Secure API endpoint implementation
- Regular dependency updates
- Code review processes
- Security-focused development practices

#### Browser Security
- Content Security Policy (CSP) compliance
- Secure HTTP headers
- Protection against common web vulnerabilities
- Cross-site scripting (XSS) prevention
- Cross-site request forgery (CSRF) protection

### Scope

This security policy applies to:
- The BDIX Connectivity Tester web application
- All API endpoints
- Source code in the official repository
- Official releases and deployments

### Out of Scope

The following are not covered by this policy:
- Third-party services or dependencies (please report to their respective maintainers)
- User-generated content on unofficial instances
- Physical security of user devices
- Network-level attacks not specific to this application

### Responsible Disclosure

We encourage responsible disclosure of security vulnerabilities. We will:
- Work with you to understand and resolve the issue
- Provide credit for the discovery (with your permission)
- Coordinate public disclosure timing
- Not take legal action for good faith reporting

### Security Resources

For more information about web application security, please refer to:
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [CWE Database](https://cwe.mitre.org/)

### Contact

For security-related questions or concerns, please contact:
- Email: [security@bdixtester.com](mailto:security@bdixtester.com)
- GitHub Security Advisory: [https://github.com/zahidhasantonmoy/bdix-tester/security/advisories](https://github.com/zahidhasantonmoy/bdix-tester/security/advisories)

Thank you for helping keep the BDIX Connectivity Tester secure!