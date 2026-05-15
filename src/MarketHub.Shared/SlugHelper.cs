using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace MarketHub.Shared;

/// <summary>
/// Helper for generating URL-safe slugs.
/// </summary>
public static partial class SlugHelper
{
    /// <summary>
    /// Generates a URL-safe slug from a given text.
    /// </summary>
    public static string Generate(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        var result = stringBuilder.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();
        
        result = InvalidCharsRegex().Replace(result, "-");
        result = MultipleHyphensRegex().Replace(result, "-");
        result = result.Trim('-');

        return result;
    }

    [GeneratedRegex(@"[^a-z0-9\-_]")]
    private static partial Regex InvalidCharsRegex();

    [GeneratedRegex(@"\-{2,}")]
    private static partial Regex MultipleHyphensRegex();
}
